import type { DiagnosticAxis, DiagnosticProfile, HomeContent } from '../content';

type Diagnostic = HomeContent['heroDiagnostic'];

/** Réponses données : levier → identifiant de la réponse. */
export type DiagnosticAnswers = Partial<Record<DiagnosticAxis, string>>;

/** Points obtenus par levier (0 à 3) ; absent : pas encore répondu. */
export type AxisScores = Partial<Record<DiagnosticAxis, number>>;

export type DiagnosticResult = {
  scores: AxisScores;
  /** Part du total obtenue, en pourcentage arrondi. */
  percent: number;
  profile: DiagnosticProfile;
  /** Leviers notés 0 ou 1 sur 3, du plus faible au moins faible. */
  weak: DiagnosticAxis[];
  /** Leviers dont le domaine OPEM est proposé (2 au plus, un seul par domaine). */
  start: DiagnosticAxis[];
  /** Niveau de maturité, de 0 (initial) à 3 (avancé) : un niveau par quart du total. */
  level: number;
  /** Part obtenue par le cadre (stratégie, structure, systèmes), puis par l'humain, en %. */
  hard: number;
  soft: number;
  /** Qui devance l'autre, à 15 points d'écart au moins ; sinon « even ». */
  balance: 'hard' | 'soft' | 'even';
  /** Levier le plus avancé s'il est noté 2 ou 3 (le premier dans l'ordre en cas d'égalité). */
  strongest?: DiagnosticAxis;
};

/** Leviers « durs » du modèle (le cadre) ; les quatre autres sont les leviers humains. */
export const HARD: DiagnosticAxis[] = ['strategie', 'structure', 'systemes'];

/** Points de chaque levier répondu : le rang de la réponse, de 0 (moins avancée) à 3. */
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

/** Écart (en points de pourcentage) à partir duquel le cadre ou l'humain « devance » l'autre. */
const BALANCE_GAP = 15;

/**
 * Profil, dans cet ordre : alignée (plus des 2/3 du total, aucun levier faible), en fondation
 * (1/3 au plus), navire sans cap (stratégie faible, tout le reste à 2 ou 3), belle mécanique (cadre
 * nettement devant l'humain), talent sans charpente (l'inverse), sinon en mouvement.
 * Règles proposées, à faire valider par OPEM.
 */
function profileOf(
  ranked: { axis: DiagnosticAxis; score: number }[],
  share: number,
  weak: DiagnosticAxis[],
): DiagnosticProfile {
  const score = (axis: DiagnosticAxis) => ranked.find((item) => item.axis === axis)?.score ?? 0;
  const hard = average(ranked.filter(({ axis }) => HARD.includes(axis)).map(({ score }) => score));
  const soft = average(ranked.filter(({ axis }) => !HARD.includes(axis)).map(({ score }) => score));
  const othersSolid = ranked.every(({ axis, score }) => axis === 'strategie' || score >= 2);

  if (share > 2 / 3 && weak.length === 0) return 'alignee';
  if (share <= 1 / 3) return 'fondation';
  if (score('strategie') <= 1 && othersSolid) return 'cap';
  if (hard - soft >= 0.75) return 'mecanique';
  if (soft - hard >= 0.75) return 'talents';
  return 'mouvement';
}

/**
 * Résultat de l'autodiagnostic 7S, calculé dans le navigateur (rien n'est envoyé).
 * Domaines proposés : ceux des leviers faibles ; à défaut, celui du levier le moins avancé.
 */
export function scoreDiagnostic(
  diagnostic: Diagnostic,
  answers: DiagnosticAnswers,
): DiagnosticResult {
  const scores = axisScores(diagnostic, answers);
  const ranked = diagnostic.questions
    .map(({ id }) => ({ axis: id, score: scores[id] ?? 0 }))
    .sort((a, b) => a.score - b.score);

  const total = ranked.reduce((sum, { score }) => sum + score, 0);
  const share = ranked.length > 0 ? total / (ranked.length * 3) : 0;

  const weak = ranked.filter(({ score }) => score <= 1).map(({ axis }) => axis);
  const candidates = weak.length > 0 ? weak : ranked.slice(0, 1).map(({ axis }) => axis);
  const domains = new Set<string>();
  const start = candidates
    .filter((axis) => {
      const { href } = diagnostic.axes[axis].domain;
      if (domains.has(href)) return false;
      domains.add(href);
      return true;
    })
    .slice(0, 2);

  const part = (hardSide: boolean) =>
    Math.round(
      (average(
        ranked.filter(({ axis }) => HARD.includes(axis) === hardSide).map(({ score }) => score),
      ) /
        3) *
        100,
    );
  const hard = part(true);
  const soft = part(false);

  // Premier levier le mieux noté, dans l'ordre des questions.
  const best = diagnostic.questions.reduce<{ axis?: DiagnosticAxis; score: number }>(
    (top, { id }) => ((scores[id] ?? 0) > top.score ? { axis: id, score: scores[id] ?? 0 } : top),
    { score: 1 },
  );

  return {
    scores,
    percent: Math.round(share * 100),
    profile: profileOf(ranked, share, weak),
    weak,
    start,
    level: Math.min(3, Math.floor(share * 4)),
    hard,
    soft,
    balance: hard - soft >= BALANCE_GAP ? 'hard' : soft - hard >= BALANCE_GAP ? 'soft' : 'even',
    strongest: best.axis,
  };
}
