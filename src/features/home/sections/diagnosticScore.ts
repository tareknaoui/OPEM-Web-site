import type { DiagnosticAxis, DiagnosticProfile, HomeContent } from '../content';

type Diagnostic = HomeContent['heroDiagnostic'];

/** Réponses données : levier → identifiant de la réponse. */
export type DiagnosticAnswers = Partial<Record<DiagnosticAxis, string>>;

/** Note de chaque levier répondu (0 à 3) ; absent : pas encore répondu. */
export type AxisScores = Partial<Record<DiagnosticAxis, number>>;

export type DiagnosticResult = {
  scores: AxisScores;
  /** Total des sept leviers, de 0 à 21. */
  total: number;
  /** Part du total obtenue, en pourcentage arrondi. */
  percent: number;
  profile: DiagnosticProfile;
  /** Niveau global, de 0 (initial) à 3 (avancé), lu sur le total. */
  level: number;
  /** Moyenne du cadre (leviers 1 à 3), puis de l'humain (leviers 4 à 7), en % de la note 3. */
  hard: number;
  soft: number;
  /** Qui dépasse l'autre d'au moins 0,75 (moyennes sur 3) ; sinon « even ». */
  balance: 'hard' | 'soft' | 'even';
  /** Points d'appui : deux leviers au plus, dans l'ordre des leviers ; vide si aucun n'atteint 2. */
  strengths: DiagnosticAxis[];
  /** Points de fragilité : les deux leviers les plus faibles parmi ceux notés 0 ou 1. */
  weak: DiagnosticAxis[];
  /** Commencer par : le premier point de fragilité, à défaut le levier le plus faible. */
  start: DiagnosticAxis;
};

/** Le cadre : leviers 1 à 3 ; les quatre autres forment l'humain. */
export const HARD: DiagnosticAxis[] = ['strategie', 'structure', 'systemes'];

/**
 * Ordre de priorité entre leviers à égalité (fragilité, commencer par) : ce qui débloque le
 * reste d'abord.
 */
export const PRIORITY: DiagnosticAxis[] = [
  'strategie',
  'structure',
  'systemes',
  'competences',
  'style',
  'personnel',
  'valeurs',
];

/** Note de chaque levier répondu : la première réponse vaut 0, la quatrième 3. */
export function axisScores(diagnostic: Diagnostic, answers: DiagnosticAnswers): AxisScores {
  const scores: AxisScores = {};
  for (const question of diagnostic.questions) {
    const rank = question.choices.findIndex((choice) => choice.id === answers[question.id]);
    if (rank >= 0) scores[question.id] = rank;
  }
  return scores;
}

const average = (values: number[]) =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

/** Écart de moyennes à partir duquel le cadre ou l'humain dépasse l'autre (profil, équilibre). */
const GAP = 0.75;

/** Niveau global lu sur le total : 0 à 5, 6 à 10, 11 à 16, 17 à 21. */
const levelOf = (total: number) => (total >= 17 ? 3 : total >= 11 ? 2 : total >= 6 ? 1 : 0);

/**
 * Résultat de l'autodiagnostic 7S, calculé dans le navigateur, sans IA et sans envoi : des
 * règles fixes, donc les mêmes réponses donnent toujours le même résultat. Règles d'OPEM.
 */
export function scoreDiagnostic(
  diagnostic: Diagnostic,
  answers: DiagnosticAnswers,
): DiagnosticResult {
  const scores = axisScores(diagnostic, answers);
  const axes = diagnostic.questions.map(({ id }) => id);
  const score = (axis: DiagnosticAxis) => scores[axis] ?? 0;

  const total = axes.reduce((sum, axis) => sum + score(axis), 0);
  const mean = average(axes.map(score));
  const hardMean = average(axes.filter((axis) => HARD.includes(axis)).map(score));
  const softMean = average(axes.filter((axis) => !HARD.includes(axis)).map(score));

  // Profil d'ensemble : la première règle vérifiée l'emporte.
  const others = average(axes.filter((axis) => axis !== 'strategie').map(score));
  const profile: DiagnosticProfile =
    axes.every((axis) => score(axis) >= 2) && mean >= 2.5
      ? 'alignee'
      : score('strategie') <= 1 && others >= 1.5
        ? 'cap'
        : hardMean >= 1.5 && hardMean - softMean >= GAP
          ? 'mecanique'
          : softMean >= 1.5 && softMean - hardMean >= GAP
            ? 'talents'
            : mean >= 1.5
              ? 'mouvement'
              : 'fondation';

  // Points d'appui : les leviers notés 3, ou à défaut 2 ; un seul levier noté 3 est complété
  // par le premier levier noté 2.
  const at = (value: number) => axes.filter((axis) => score(axis) === value);
  const top = at(3);
  const strengths = (
    top.length >= 2 ? top : top.length === 1 ? [...top, ...at(2).slice(0, 1)] : at(2)
  )
    .slice(0, 2)
    .sort((a, b) => axes.indexOf(a) - axes.indexOf(b));

  // Du plus faible au moins faible ; à égalité, l'ordre de priorité.
  const byWeakness = [...PRIORITY].sort((a, b) => score(a) - score(b));
  const weak = byWeakness.filter((axis) => score(axis) <= 1).slice(0, 2);

  return {
    scores,
    total,
    percent: axes.length > 0 ? Math.round((total / (axes.length * 3)) * 100) : 0,
    profile,
    level: levelOf(total),
    hard: Math.round((hardMean / 3) * 100),
    soft: Math.round((softMean / 3) * 100),
    balance: hardMean - softMean >= GAP ? 'hard' : softMean - hardMean >= GAP ? 'soft' : 'even',
    strengths,
    weak,
    start: weak[0] ?? byWeakness[0] ?? 'strategie',
  };
}
