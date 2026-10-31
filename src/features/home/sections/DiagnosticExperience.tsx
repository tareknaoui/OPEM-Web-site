import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CloseIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import type { DiagnosticContextId, HomeContent } from '../content';
import { HARD, scoreDiagnostic, type DiagnosticAnswers } from './diagnosticScore';
import { SevenSRadar } from './SevenSRadar';
import styles from './DiagnosticExperience.module.css';

type Diagnostic = HomeContent['heroDiagnostic'];

/** Réponses aux questions sur l'organisation : question → identifiant de la réponse. */
type ContextAnswers = Partial<Record<DiagnosticContextId, string>>;

type DiagnosticExperienceProps = {
  diagnostic: Diagnostic;
  open: boolean;
  onClose: () => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Pourcentage écrit selon la langue (lu par les lecteurs d'écran). */
const percentFormat = (lang: string) =>
  new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { style: 'percent' });

/**
 * L'autodiagnostic 7S en plein écran, sur bleu nuit (<dialog> natif : focus gardé, Échap,
 * page inerte derrière). D'abord quelques questions sur l'organisation (secteur, effectif,
 * fonction), radar en attente ; puis une question par levier : très grand numéro ambre, à côté
 * la famille du levier et son nom, réponses au clic ou au clavier (A à D, 1 à 4), le radar se déforme
 * à chaque réponse. À la fin, le profil, le pourcentage qui défile, le niveau de maturité,
 * l'équilibre cadre / humain, notre lecture, les leviers à renforcer et les domaines ; sous le
 * radar, « Refaire le diagnostic » puis, en grand, « Être rappelé avec ce résultat ».
 * Fermer remet le diagnostic à zéro.
 */
export function DiagnosticExperience({ diagnostic, open, onClose }: DiagnosticExperienceProps) {
  const { lang } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<ContextAnswers>({});
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const ids = useId();

  const contextCount = diagnostic.context.questions.length;
  const total = diagnostic.questions.length;
  const contextQuestion = step < contextCount ? diagnostic.context.questions[step] : undefined;
  const leverQuestion =
    step >= contextCount ? diagnostic.questions.at(step - contextCount) : undefined;
  const result = scoreDiagnostic(diagnostic, answers);

  // Écran en cours, quelle que soit la phase : organisation, puis leviers.
  const screen = contextQuestion
    ? {
        id: contextQuestion.id,
        text: contextQuestion.text,
        choices: contextQuestion.choices,
        word: contextQuestion.label,
        group: diagnostic.context.label,
        index: step,
        count: contextCount,
        progress: diagnostic.context.progress,
        title: contextQuestion.label,
        selected: context[contextQuestion.id],
      }
    : leverQuestion
      ? {
          id: leverQuestion.id,
          text: leverQuestion.text,
          choices: leverQuestion.choices,
          word: diagnostic.axes[leverQuestion.id].label,
          // Famille du levier : le cadre (stratégie, structure, systèmes) ou l'humain.
          group: diagnostic.analysis[HARD.includes(leverQuestion.id) ? 'hard' : 'soft'].label,
          index: step - contextCount,
          count: total,
          progress: diagnostic.progress,
          title: diagnostic.axes[leverQuestion.id].title,
          selected: answers[leverQuestion.id],
        }
      : undefined;
  // Au-delà de 4 réponses (secteur) : grille de boutons, sans touches.
  const withKeys = (screen?.choices.length ?? 0) <= diagnostic.keys.length;

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

  const handleClose = () => {
    setStep(0);
    setContext({});
    setAnswers({});
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
          <header className={styles.top}>
            <div className={cx('container', styles.topInner)}>
              <span className={styles.brand}>{diagnostic.label}</span>
              <ol className={styles.segments} aria-hidden="true">
                {[...diagnostic.context.questions, ...diagnostic.questions].map((item, index) => (
                  <li
                    key={item.id}
                    className={styles.segment}
                    data-phase-start={index === contextCount || undefined}
                    data-done={index < step || undefined}
                    data-current={index === step || undefined}
                  />
                ))}
              </ol>
              <button
                type="button"
                className={styles.close}
                onClick={() => dialogRef.current?.close()}
              >
                {diagnostic.close}
                <CloseIcon size={20} />
              </button>
            </div>
          </header>

          <div className={cx('container', styles.body)} data-mode={screen ? 'question' : 'result'}>
            {screen ? (
              <div key={step} className={styles.content}>
                {/* Grand numéro ambre | famille (« Le cadre », « L'humain », « Votre
                    organisation ») et nom du levier, séparés par un filet. */}
                <p className={styles.counter}>
                  <span className={styles.number} aria-hidden="true">
                    <span className={styles.index}>{pad(screen.index + 1)}</span>
                    <span className={styles.of}>/{pad(screen.count)}</span>
                  </span>
                  <span className={styles.lever} aria-hidden="true">
                    <span className={styles.group}>{screen.group}</span>
                    <span className={styles.leverName}>{screen.word}</span>
                  </span>
                  <span className="sr-only">
                    {screen.progress
                      .replace('{current}', String(screen.index + 1))
                      .replace('{total}', String(screen.count))}
                    {' – '}
                    {screen.title}
                  </span>
                </p>
                <h2
                  ref={headingRef}
                  id={`${ids}-question`}
                  tabIndex={-1}
                  className={styles.question}
                >
                  {screen.text}
                </h2>
                <ul
                  className={styles.choices}
                  data-layout={withKeys ? undefined : 'grid'}
                  aria-labelledby={`${ids}-question`}
                >
                  {screen.choices.map((choice, index) => (
                    <li key={choice.id} style={{ '--i': index } as CSSProperties}>
                      <button
                        type="button"
                        className={styles.choice}
                        aria-current={screen.selected === choice.id ? 'true' : undefined}
                        onClick={() => choose(choice.id)}
                      >
                        {withKeys && (
                          <span className={styles.key} aria-hidden="true">
                            {diagnostic.keys[index]}
                          </span>
                        )}
                        <span className={styles.choiceLabel}>{choice.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {step > 0 && (
                  <p className={styles.foot}>
                    <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>
                      <ArrowRightIcon size={16} className={styles.backIcon} />
                      {diagnostic.back}
                    </button>
                  </p>
                )}
              </div>
            ) : (
              <ResultView
                diagnostic={diagnostic}
                result={result}
                context={context}
                format={percentFormat(lang)}
                headingRef={headingRef}
              />
            )}

            <div className={styles.visual}>
              {contextQuestion ? (
                <SevenSRadar key="idle" diagnostic={diagnostic} mode="idle" tone="dark" />
              ) : leverQuestion ? (
                <SevenSRadar
                  key="live"
                  diagnostic={diagnostic}
                  mode="live"
                  scores={result.scores}
                  current={leverQuestion.id}
                  tone="dark"
                />
              ) : (
                <>
                  <SevenSRadar
                    key="result"
                    diagnostic={diagnostic}
                    mode="result"
                    scores={result.scores}
                    weak={result.weak}
                    tone="dark"
                  />
                  <p className={styles.legend} aria-hidden="true">
                    <span className={styles.legendYours}>{diagnostic.result.yours}</span>
                    <span className={styles.legendIdeal}>{diagnostic.result.ideal}</span>
                    {result.weak.length > 0 && (
                      <span className={styles.legendWeak}>{diagnostic.result.weakTitle}</span>
                    )}
                  </p>
                </>
              )}
            </div>

            {/* Sous le radar (ordinateur) ; à la fin du résultat (mobile). */}
            {!screen && (
              <div className={styles.actions}>
                <div className={styles.actionsInner}>
                  <button
                    type="button"
                    className={cx(styles.back, styles.restart)}
                    onClick={() => {
                      setAnswers({});
                      setStep(contextCount);
                    }}
                  >
                    {diagnostic.result.restart}
                  </button>
                  {/* L'action principale, en grand et en dernier : on ne peut pas la manquer. */}
                  <Link
                    to={callbackHref(diagnostic, result, context, answers)}
                    className={cx('btn btn-light', styles.callback)}
                  >
                    {diagnostic.result.callback.label}
                    <ArrowRightIcon size={20} className="arrow" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}

/** Lien de rappel : les réponses en paramètres, pour pré-remplir le futur formulaire. */
function callbackHref(
  diagnostic: Diagnostic,
  result: ReturnType<typeof scoreDiagnostic>,
  context: ContextAnswers,
  answers: DiagnosticAnswers,
) {
  const params = new URLSearchParams({ source: 'autodiagnostic' });
  for (const [id, choice] of Object.entries(context)) params.set(id, choice);
  for (const [axis, choice] of Object.entries(answers)) params.set(axis, choice);
  params.set('profil', result.profile);
  params.set('maturite', String(result.percent));
  return `${diagnostic.result.callback.href}?${params.toString()}`;
}

type ResultViewProps = {
  diagnostic: Diagnostic;
  result: ReturnType<typeof scoreDiagnostic>;
  context: ContextAnswers;
  format: Intl.NumberFormat;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

function ResultView({ diagnostic, result, context, format, headingRef }: ResultViewProps) {
  const labels = diagnostic.result;
  const { analysis } = diagnostic;
  const profile = diagnostic.profiles[result.profile];
  const level = analysis.levels[result.level];
  const percent = (value: number) => format.format(value / 100);

  // Rappel du contexte sous le titre : « Industrie · De 50 à 249 personnes ».
  const facts = diagnostic.context.questions
    .filter(({ id }) => id !== 'fonction')
    .map(({ id, choices }) => choices.find((choice) => choice.id === context[id])?.label)
    .filter(Boolean);

  // Notre lecture : niveau, équilibre cadre / humain, point d'appui, puis l'effectif.
  const reading = [
    level?.text,
    analysis.balance[result.balance]
      .replace('{hard}', percent(result.hard))
      .replace('{soft}', percent(result.soft)),
    result.strongest
      ? analysis.strength.replace('{axis}', diagnostic.axes[result.strongest].title)
      : analysis.noStrength,
    context.effectif ? analysis.sizes[context.effectif] : undefined,
  ].filter(Boolean);

  return (
    <div className={styles.content}>
      <p className={styles.eyebrow}>
        {labels.profileLabel}
        {facts.length > 0 && <span className={styles.facts}>{facts.join(' · ')}</span>}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className={styles.profile}>
        {profile.name}
      </h2>
      <p className={styles.profileText}>{profile.text}</p>

      <div className={styles.metrics}>
        <p className={styles.score}>
          <span
            className={styles.scoreValue}
            style={{ '--target': result.percent } as CSSProperties}
            aria-hidden="true"
          />
          <span className="sr-only">{percent(result.percent)}</span>{' '}
          <span className={styles.scoreLabel}>{labels.scoreLabel}</span>
        </p>
        <div className={styles.level}>
          <p className={styles.levelName}>
            <span className={styles.levelLabel}>
              {analysis.levelLabel.replace('{level}', String(result.level + 1))}
            </span>{' '}
            {level?.name}
          </p>
          <ol className={styles.scale} aria-hidden="true">
            {analysis.levels.map((item, index) => (
              <li
                key={item.name}
                data-on={index <= result.level || undefined}
                data-current={index === result.level || undefined}
              />
            ))}
          </ol>
        </div>
      </div>

      <dl className={styles.balance}>
        {(['hard', 'soft'] as const).map((side) => (
          <div key={side} className={styles.bar}>
            <dt>
              <span className={styles.barLabel}>{analysis[side].label}</span>
              <span className={styles.hint}>{analysis[side].hint}</span>
            </dt>
            <dd>
              <span className={styles.track} aria-hidden="true">
                <span
                  className={styles.fill}
                  style={{ '--value': `${result[side]}%` } as CSSProperties}
                />
              </span>
              <span className={styles.barValue}>{percent(result[side])}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.reading}>
        <h3 className={styles.subtitle}>{analysis.title}</h3>
        <ul className={styles.readingList}>
          {reading.map((sentence) => (
            <li key={sentence}>{sentence}</li>
          ))}
        </ul>
      </div>

      <div className={styles.summary}>
        <div>
          <h3 className={styles.subtitle}>{labels.weakTitle}</h3>
          {result.weak.length > 0 ? (
            <ul className={styles.chips}>
              {result.weak.map((axis) => (
                <li key={axis} className={styles.chip}>
                  {diagnostic.axes[axis].title}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.small}>{labels.noWeak}</p>
          )}
        </div>
        <div>
          <h3 className={styles.subtitle}>{labels.startTitle}</h3>
          <ul className={styles.links}>
            {result.start.map((axis) => {
              const { label, href } = diagnostic.axes[axis].domain;
              // Dernier mot et flèche insécables : la flèche ne passe jamais seule à la ligne.
              const cut = label.lastIndexOf(' ') + 1;
              return (
                <li key={axis}>
                  <Link to={href} className={styles.domainLink}>
                    {label.slice(0, cut)}
                    <span className={styles.nowrap}>
                      {label.slice(cut)}
                      <ArrowRightIcon size={16} className="arrow" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
