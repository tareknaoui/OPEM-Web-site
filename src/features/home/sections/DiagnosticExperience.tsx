import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { ArrowRightIcon, CheckIcon, CloseIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import type { DiagnosticAxis, DiagnosticContextId, HomeContent } from '../content';
import { DiagnosticResult } from './DiagnosticResult';
import { scoreDiagnostic, type DiagnosticAnswers } from './diagnosticScore';
import { LeverScenes, type SceneId } from './LeverScenes';
import styles from './DiagnosticExperience.module.css';

type Diagnostic = HomeContent['heroDiagnostic'];

/** Écran d'accueil : les illustrations des leviers défilent en fond, dans cet ordre. */
const TOUR: DiagnosticAxis[] = [
  'strategie',
  'structure',
  'systemes',
  'valeurs',
  'style',
  'personnel',
  'competences',
];
const TOUR_MS = 4500;
/** Questions sur l'organisation qui ont leur propre illustration (les autres : « organisation »). */
const CONTEXT_SCENES: Partial<Record<DiagnosticContextId, SceneId>> = {
  secteur: 'secteur',
  effectif: 'taille',
  fonction: 'fonction',
};
/** Réponses auxquelles le clavier répond : A à D, ou 1 à 4. */
const KEYS = 4;

/** Réponses aux questions sur l'organisation : question → identifiant de la réponse. */
type ContextAnswers = Partial<Record<DiagnosticContextId, string>>;

type DiagnosticExperienceProps = {
  diagnostic: Diagnostic;
  open: boolean;
  onClose: () => void;
};

type ContextChoice = Diagnostic['context']['questions'][number]['choices'][number];

/**
 * Libellé d'une réponse sur l'organisation : la taille s'affiche en catégorie d'entreprise
 * (« Petite entreprise, de 10 à 49 personnes ») pour l'EPE et l'entreprise privée seulement.
 */
function choiceLabel(diagnostic: Diagnostic, context: ContextAnswers, choice: ContextChoice) {
  const company = diagnostic.context.companyStatuses.includes(context.statut ?? '');
  return (company && choice.companyLabel) || choice.label;
}

/** Étape de l'écran d'accueil, avant la première question (étape 0). */
const WELCOME = -1;

const pad = (n: number) => String(n).padStart(2, '0');

/** Pourcentage écrit selon la langue (lu par les lecteurs d'écran). */
const percentFormat = (lang: string) =>
  new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { style: 'percent' });

/**
 * L'autodiagnostic 7S en plein écran, sur bleu nuit (<dialog> natif : focus gardé, Échap,
 * page inerte derrière). En fond, une illustration au trait du levier montré (LeverScenes).
 * D'abord un écran d'accueil (titre, bouton, illustrations des leviers qui défilent), quelques
 * questions sur l'organisation (statut puis secteur, taille, fonction) ; puis une question par
 * levier : très grand numéro ambre, à côté la famille du levier et son nom, réponses au clic ou au
 * clavier (A à D, 1 à 4). Pendant les questions, à droite, seulement l'illustration du levier
 * (pas de carte). À la fin, le profil, le pourcentage qui défile, le niveau de maturité,
 * l'écran de résultat (DiagnosticResult), seul, sans les questions autour. Entre le dernier
 * levier et le résultat, un écran de fin (« Voir mon résultat »). En haut, les trois
 * étapes et la barre d'avancement. « Quitter » ramène à l'accueil ; « Fermer » (accueil) ou
 * Échap ferment le plein écran. Les deux remettent le diagnostic à zéro.
 */
export function DiagnosticExperience({ diagnostic, open, onClose }: DiagnosticExperienceProps) {
  const { lang } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(WELCOME);
  // Levier allumé sur la carte de l'écran d'accueil : l'illustration de fond le suit.
  const [featured, setFeatured] = useState<DiagnosticAxis>('strategie');
  const nextScene = useCallback(
    () => setFeatured((current) => TOUR[(TOUR.indexOf(current) + 1) % TOUR.length]!),
    [],
  );
  const [context, setContext] = useState<ContextAnswers>({});
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const ids = useId();

  const contextQuestions = diagnostic.context.questions;
  // Écrans sur l'organisation, et numéro de question de chacun : un second temps (le secteur
  // après le statut) garde le numéro de la question qu'il complète.
  const contextCount = contextQuestions.length;
  const contextNumbers = contextQuestions.map(
    (_, index) => contextQuestions.slice(0, index + 1).filter((item) => !item.secondStep).length,
  );
  const contextTotal = contextNumbers.at(-1) ?? 0;
  const total = diagnostic.questions.length;
  const contextQuestion = step < contextCount ? contextQuestions[step] : undefined;
  const firstStep = contextQuestion?.secondStep ? contextQuestions[step - 1] : undefined;
  const firstAnswer = firstStep?.choices.find((choice) => choice.id === context[firstStep.id]);
  // Segment de la barre de progression : un par question (pas par écran).
  const segment =
    step < contextCount ? (contextNumbers[step] ?? 1) - 1 : contextTotal + step - contextCount;
  const leverQuestion =
    step >= contextCount ? diagnostic.questions.at(step - contextCount) : undefined;
  const result = scoreDiagnostic(diagnostic, answers);
  const welcome = step === WELCOME;
  // Après le dernier levier : l'écran de fin, puis le résultat.
  const doneStep = contextCount + total;
  const done = step === doneStep;
  const finished = step >= doneStep;
  // Étape du parcours : votre organisation (0), sept leviers (1), votre résultat (2).
  const phase = step < contextCount ? 0 : finished ? 2 : 1;

  // Écran en cours, quelle que soit la phase : organisation, puis leviers.
  const screen = contextQuestion
    ? {
        id: contextQuestion.id,
        text: contextQuestion.text,
        help: contextQuestion.help,
        choices: contextQuestion.choices,
        word: contextQuestion.label,
        group: diagnostic.context.label,
        index: (contextNumbers[step] ?? 1) - 1,
        count: contextTotal,
        progress: diagnostic.context.progress,
        title: contextQuestion.label,
        selected: context[contextQuestion.id],
      }
    : leverQuestion
      ? {
          id: leverQuestion.id,
          text: leverQuestion.text,
          help: diagnostic.leverHelp,
          choices: leverQuestion.choices,
          // Intitulé du levier (« Cap et priorités ») ; à défaut, son nom court.
          word: leverQuestion.title ?? diagnostic.axes[leverQuestion.id].label,
          // « Étape 2 · Levier 1 sur 7 »
          group: diagnostic.progress
            .replace('{current}', String(step - contextCount + 1))
            .replace('{total}', String(total)),
          index: step - contextCount,
          count: total,
          progress: diagnostic.progress,
          title: leverQuestion.title ?? diagnostic.axes[leverQuestion.id].title,
          selected: answers[leverQuestion.id],
        }
      : undefined;
  // Écran de résultat : réponses sur l'organisation (« Entreprise privée · Industrie · … »,
  // sans la fonction), et libellé de la fonction choisie (valeur de départ du formulaire).
  const answerLabel = (question: (typeof contextQuestions)[number]) => {
    const choice = question.choices.find((item) => item.id === context[question.id]);
    return choice ? choiceLabel(diagnostic, context, choice) : undefined;
  };
  const facts = contextQuestions
    .filter(({ id }) => id !== 'fonction')
    .map(answerLabel)
    .filter((label): label is string => Boolean(label));
  const fonctionQuestion = contextQuestions.find(({ id }) => id === 'fonction');
  const fonction = (fonctionQuestion && answerLabel(fonctionQuestion)) ?? '';
  // Jusqu'à 4 réponses (taille, leviers) : une colonne, et le clavier y répond (A à D, 1 à 4),
  // sans lettre affichée devant les réponses (le test ne doit pas ressembler à un examen).
  // Au-delà : grille de boutons (statut) ; pastilles au-delà de 8 réponses (fonction) ou par
  // famille (secteur).
  const choiceCount = screen?.choices.length ?? 0;
  const withKeys = choiceCount <= KEYS;
  const layout = withKeys ? undefined : choiceCount > 8 ? 'chips' : 'grid';
  // Réponses rangées par famille (secteurs) ; sinon un seul groupe, sans titre.
  const groups: { family?: string; choices: { id: string; label: string; index: number }[] }[] = [];
  (screen?.choices as ContextChoice[] | undefined)?.forEach((choice, index) => {
    const item = { id: choice.id, label: choiceLabel(diagnostic, context, choice), index };
    const last = groups.at(-1);
    if (last && last.family === choice.family) last.choices.push(item);
    else groups.push({ family: choice.family, choices: [item] });
  });
  const families = groups.some((group) => group.family);
  // Coupure entre les deux colonnes de familles : la plus équilibrée, chaque famille pesant
  // ses réponses plus son titre.
  const weight = (list: typeof groups) =>
    list.reduce((sum, group) => sum + group.choices.length + 1.5, 0);
  const half = groups.reduce(
    (best, _, index) =>
      Math.max(weight(groups.slice(0, index)), weight(groups.slice(index))) <
      Math.max(weight(groups.slice(0, best)), weight(groups.slice(best)))
        ? index
        : best,
    Math.ceil(groups.length / 2),
  );
  const renderGroup = (group: (typeof groups)[number], groupIndex: number) => (
    <div key={group.family ?? 'all'} className={cx(group.family && styles.family)}>
      {group.family && (
        <p id={`${ids}-family-${groupIndex}`} className={styles.familyLabel}>
          {group.family}
        </p>
      )}
      <ul
        className={styles.choices}
        data-layout={group.family ? 'chips' : layout}
        aria-labelledby={cx(`${ids}-question`, group.family && `${ids}-family-${groupIndex}`)}
      >
        {group.choices.map((choice) => (
          <li key={choice.id} style={{ '--i': choice.index } as CSSProperties}>
            <button
              type="button"
              className={styles.choice}
              aria-current={screen?.selected === choice.id ? 'true' : undefined}
              onClick={() => choose(choice.id)}
            >
              <span className={styles.choiceLabel}>{choice.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  const mode = welcome ? 'welcome' : screen ? 'question' : done ? 'done' : 'result';
  const scene: SceneId | null = welcome
    ? featured
    : contextQuestion
      ? (CONTEXT_SCENES[contextQuestion.id] ?? 'organisation')
      : done
        ? 'fin'
        : (leverQuestion?.id ?? null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // À chaque écran, le focus passe sur son titre (lecteurs d'écran, clavier).
  useEffect(() => {
    if (open) headingRef.current?.focus({ preventScroll: true });
  }, [open, step]);

  // Remise à zéro : sortie du questionnaire (« Quitter ») ou fermeture.
  const reset = () => {
    setStep(WELCOME);
    setFeatured('strategie');
    setContext({});
    setAnswers({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const choose = (choiceId: string) => {
    if (contextQuestion)
      setContext((previous) => ({ ...previous, [contextQuestion.id]: choiceId }));
    else if (leverQuestion)
      setAnswers((previous) => ({ ...previous, [leverQuestion.id]: choiceId }));
    setStep(step + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (!screen || !withKeys || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    const index = Math.max('abcd'.indexOf(key), '1234'.indexOf(key));
    const choice = key.length === 1 ? screen.choices[index] : undefined;
    if (!choice) return;
    event.preventDefault();
    choose(choice.id);
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={diagnostic.label}
      onClose={handleClose}
      onKeyDown={onKeyDown}
    >
      {open && (
        <>
          <LeverScenes active={scene} />
          <header className={styles.top} data-mode={mode}>
            <div className={cx('container', styles.topInner)}>
              {!welcome && (
                <>
                  {/* Les trois étapes du parcours, l'étape en cours en blanc. */}
                  <ol className={styles.steps}>
                    {diagnostic.steps.map((label, index) => (
                      <li
                        key={label}
                        data-done={index < phase || undefined}
                        aria-current={index === phase ? 'step' : undefined}
                      >
                        {label}
                      </li>
                    ))}
                  </ol>
                  <div className={styles.progress}>
                    <ol className={styles.segments} aria-hidden="true">
                      {[
                        ...contextQuestions.filter((item) => !item.secondStep),
                        ...diagnostic.questions,
                      ].map((item, index) => (
                        <li
                          key={item.id}
                          className={styles.segment}
                          data-phase-start={index === contextTotal || undefined}
                          data-done={index < segment || undefined}
                          data-current={index === segment || undefined}
                        />
                      ))}
                    </ol>
                  </div>
                </>
              )}
              {/* Accueil : « Fermer » ferme le plein écran ; ensuite, « Quitter » ramène à
                  l'accueil et efface les réponses. */}
              <button
                type="button"
                className={styles.close}
                onClick={welcome ? () => dialogRef.current?.close() : reset}
              >
                {welcome ? diagnostic.welcome.close : diagnostic.close}
                <CloseIcon size={20} />
              </button>
            </div>
          </header>

          <div className={cx('container', styles.body)} data-mode={mode}>
            {welcome ? (
              <Welcome diagnostic={diagnostic} headingRef={headingRef} onStart={() => setStep(0)} />
            ) : screen ? (
              <div key={step} className={styles.content} data-wide={families || undefined}>
                {/* Surtitre de l'étape (« Étape 2 · Levier 1 sur 7 », « Étape 1 · Votre
                    organisation »), comme celui de l'accueil du site : trait ambre, capitales. */}
                <p className={styles.kicker} aria-hidden="true">
                  {screen.group}
                </p>
                {/* Grand numéro ambre | intitulé, séparés par un filet. Un seul compteur sur
                    les dix questions (01/10 à 10/10), comme le promet l'écran d'accueil. */}
                <p className={styles.counter}>
                  <span className={styles.number} aria-hidden="true">
                    <span className={styles.index}>{pad(segment + 1)}</span>
                    <span className={styles.of}>/{pad(contextTotal + total)}</span>
                  </span>
                  <span className={styles.lever} aria-hidden="true">
                    <span className={styles.leverName}>{screen.word}</span>
                  </span>
                  <span className="sr-only">
                    {screen.progress
                      .replace('{current}', String(screen.index + 1))
                      .replace('{total}', String(screen.count))}
                    {', '}
                    {screen.title}
                  </span>
                </p>
                {/* Second temps : rappel du premier, avec un lien pour y revenir. */}
                {firstStep && firstAnswer && (
                  <p className={styles.recall}>
                    <span id={`${ids}-recall`}>
                      {diagnostic.context.recall
                        .replace('{question}', firstStep.label)
                        .replace('{answer}', firstAnswer.label)}
                    </span>
                    <button
                      type="button"
                      className={styles.edit}
                      aria-describedby={`${ids}-recall`}
                      onClick={() => setStep(step - 1)}
                    >
                      {diagnostic.context.edit}
                    </button>
                  </p>
                )}
                <h2
                  ref={headingRef}
                  id={`${ids}-question`}
                  tabIndex={-1}
                  className={styles.question}
                >
                  {screen.text}
                </h2>
                {screen.help && <p className={styles.help}>{screen.help}</p>}
                {families ? (
                  // Secteurs et fonctions : deux colonnes de familles (une seule sur téléphone), le nom de
                  // chaque famille au-dessus de ses réponses.
                  <div className={styles.families}>
                    {[groups.slice(0, half), groups.slice(half)].map((column, columnIndex) => (
                      <div key={columnIndex} className={styles.familyColumn}>
                        {column.map((group, index) =>
                          renderGroup(group, columnIndex === 0 ? index : half + index),
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  groups.map(renderGroup)
                )}
                {/* Pas de retour sur la première question. */}
                {step > 0 && (
                  <p className={styles.foot}>
                    <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>
                      <ArrowRightIcon size={16} className={styles.backIcon} />
                      {diagnostic.back}
                    </button>
                  </p>
                )}
              </div>
            ) : done ? (
              <div className={styles.content}>
                <h2 ref={headingRef} tabIndex={-1} className={styles.doneTitle}>
                  {diagnostic.done.title}
                </h2>
                <p className={styles.doneText}>{diagnostic.done.text}</p>
                <button
                  type="button"
                  className={cx('btn btn-light', styles.doneButton)}
                  onClick={() => setStep(doneStep + 1)}
                >
                  {diagnostic.done.cta}
                  <ArrowRightIcon size={20} className="arrow" />
                </button>
                <p className={styles.foot}>
                  <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>
                    <ArrowRightIcon size={16} className={styles.backIcon} />
                    {diagnostic.back}
                  </button>
                </p>
              </div>
            ) : (
              <DiagnosticResult
                diagnostic={diagnostic}
                result={result}
                context={context}
                answers={answers}
                facts={facts}
                fonction={fonction}
                format={percentFormat(lang)}
                headingRef={headingRef}
                onReview={() => setStep(0)}
                onRetake={reset}
              />
            )}

            {/* Légende sous l'illustration à l'accueil ; ailleurs, seule l'illustration de fond
                occupe la droite. */}
            {welcome && (
              <div className={styles.visual}>
                <WelcomeTour diagnostic={diagnostic} onNext={nextScene} />
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}

type WelcomeProps = {
  diagnostic: Diagnostic;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
};

/**
 * Écran d'accueil : l'étiquette, le titre en deux temps, puis une carte avec le sous-titre, ce
 * que le test apporte et le bouton de départ.
 */
function Welcome({ diagnostic, headingRef, onStart }: WelcomeProps) {
  const { welcome } = diagnostic;
  return (
    <div className={styles.content}>
      <p className={styles.welcomeLabel}>{welcome.label}</p>
      <h2 ref={headingRef} tabIndex={-1} className={styles.welcomeTitle}>
        {welcome.title[0]} <span className={styles.welcomeAccent}>{welcome.title[1]}</span>
      </h2>
      <div className={styles.welcomeCard}>
        <p className={styles.welcomeText}>{welcome.subtitle}</p>
        <ul className={styles.benefits}>
          {welcome.benefits.map((benefit) => (
            <li key={benefit}>
              <CheckIcon size={18} className={styles.benefitIcon} />
              {benefit}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={cx('btn btn-primary', styles.welcomeStart)}
          onClick={onStart}
        >
          {welcome.start}
          <ArrowRightIcon size={20} className="arrow" />
        </button>
      </div>
    </div>
  );
}

/**
 * Accueil, sous l'illustration de fond : la légende, et le bouton qui arrête le défilement des
 * illustrations (WCAG 2.2.2). Le défilement ne démarre pas si l'utilisateur demande moins
 * d'animations.
 */
function WelcomeTour({ diagnostic, onNext }: { diagnostic: Diagnostic; onNext: () => void }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paused, setPaused] = useState(false);
  const moving = !paused && !reduced;
  const { welcome } = diagnostic;

  useEffect(() => {
    if (!moving) return;
    const timer = setInterval(onNext, TOUR_MS);
    return () => clearInterval(timer);
  }, [moving, onNext]);

  return (
    <div className={styles.tour}>
      <Caption text={welcome.caption} highlight={welcome.captionHighlight} />
      {!reduced && (
        <button
          type="button"
          className={styles.tourToggle}
          aria-label={paused ? welcome.play : welcome.pause}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
        </button>
      )}
    </div>
  );
}

/** Légende de l'écran d'accueil, un passage en ambre et en gras. */
function Caption({ text, highlight }: { text: string; highlight: string }) {
  const at = text.indexOf(highlight);
  return (
    <p className={styles.welcomeCaption}>
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <strong className={styles.captionHighlight}>{highlight}</strong>
          {text.slice(at + highlight.length)}
        </>
      )}
    </p>
  );
}
