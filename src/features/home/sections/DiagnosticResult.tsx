import { useId, useState, type CSSProperties, type FormEvent, type RefObject } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { http } from '@/lib/http';
import type {
  DiagnosticAxis,
  DiagnosticContextId,
  HomeContent,
  Link as LinkType,
} from '../content';
import { scoreDiagnostic, type DiagnosticAnswers } from './diagnosticScore';
import { SevenSRadar } from './SevenSRadar';
import styles from './DiagnosticResult.module.css';

type Diagnostic = HomeContent['heroDiagnostic'];
type ContextAnswers = Partial<Record<DiagnosticContextId, string>>;
type Result = ReturnType<typeof scoreDiagnostic>;

type DiagnosticResultProps = {
  diagnostic: Diagnostic;
  result: Result;
  context: ContextAnswers;
  answers: DiagnosticAnswers;
  /** Libellés des réponses sur l'organisation (statut, secteur, taille), dans l'ordre. */
  facts: string[];
  /** Libellé de la fonction choisie : valeur de départ du champ « Fonction ». */
  fonction: string;
  format: Intl.NumberFormat;
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** Revoir mes réponses : première question, réponses conservées. */
  onReview: () => void;
  /** Refaire le test : réponses effacées, retour à l'écran d'accueil. */
  onRetake: () => void;
};

/**
 * Écran de résultat de l'autodiagnostic, textes et règles d'OPEM : votre profil, votre empreinte
 * (radar, niveau global, cadre et humain), points d'appui, points de fragilité, commencer par,
 * votre rôle, pour aller plus loin (rapport détaillé contre coordonnées, consultant, nouveau
 * test). Les phrases s'ajustent à la taille, au statut, au secteur et à la fonction.
 */
export function DiagnosticResult({
  diagnostic,
  result,
  context,
  answers,
  facts,
  fonction,
  format,
  headingRef,
  onReview,
  onRetake,
}: DiagnosticResultProps) {
  const ids = useId();
  const labels = diagnostic.result;
  const { analysis, modulations: mod, levers, axes } = diagnostic;
  const profile = diagnostic.profiles[result.profile];
  const level = analysis.levels[result.level];
  const percent = (value: number) => format.format(value / 100);
  const note = (axis: DiagnosticAxis) => result.scores[axis] ?? 0;
  const domainsOf = (axis: DiagnosticAxis) =>
    (note(axis) >= 2 && axes[axis].domainsFrom2) || axes[axis].domains;

  // Constat d'un levier, avec la nuance de sécurité quand elle s'applique.
  const finding = (axis: DiagnosticAxis) => {
    const text = levers[axis].findings?.[note(axis)];
    const safety =
      axis === mod.safety.lever &&
      note(axis) === mod.safety.note &&
      mod.safety.sectors.includes(context.secteur ?? '');
    return [text, safety ? mod.safety.text : undefined].filter(Boolean).join(' ');
  };

  // Commencer par : levier prioritaire, première action et phrases selon le répondant.
  const start = result.start;
  const action = levers[start].actions?.[note(start)];
  const actionNotes = [
    mod.smallOrg.sizes.includes(context.effectif ?? '') ? mod.smallOrg.text : undefined,
    mod.publicDelegation.statuses.includes(context.statut ?? '') &&
    mod.publicDelegation.levers.includes(start)
      ? mod.publicDelegation.text
      : undefined,
  ].filter(Boolean);
  const profileNotes = [
    context.effectif ? mod.sizes[context.effectif] : undefined,
    mod.statuses.find((item) => item.ids.includes(context.statut ?? ''))?.text,
    mod.sectors.find(
      (item) => item.ids.includes(context.secteur ?? '') && item.levers.includes(start),
    )?.text,
  ].filter(Boolean);
  const role = mod.roles.find((item) => item.ids.includes(context.fonction ?? ''))?.text;
  const formId = `${ids}-report`;

  return (
    <div className={styles.result}>
      {/* 1. Votre profil */}
      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          {labels.profileLabel}
          {facts.length > 0 && <span className={styles.facts}>{facts.join(' · ')}</span>}
        </p>
        <h2 ref={headingRef} tabIndex={-1} className={styles.profile}>
          {profile.name}
        </h2>
        <p className={styles.lead}>{profile.text}</p>
      </header>

      {/* 2. Votre empreinte : radar, niveau global, cadre et humain. */}
      <section className={styles.footprint} aria-labelledby={`${ids}-footprint`}>
        <div className={styles.radar}>
          <SevenSRadar
            diagnostic={diagnostic}
            mode="result"
            scores={result.scores}
            weak={result.weak}
            tone="dark"
          />
          <p className={styles.legend} aria-hidden="true">
            <span className={styles.legendYours}>{labels.yours}</span>
            <span className={styles.legendIdeal}>{labels.ideal}</span>
            {result.weak.length > 0 && (
              <span className={styles.legendWeak}>{labels.weakTitle}</span>
            )}
          </p>
        </div>
        <div>
          <h3 id={`${ids}-footprint`} className={styles.blockTitle}>
            {labels.footprintTitle}
          </h3>
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
            <p className={styles.text}>{level?.text}</p>
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
          <p className={styles.text}>{analysis.balance[result.balance]}</p>
        </div>
      </section>

      {/* 3. Vos points d'appui · 4. Vos points de fragilité */}
      <div className={styles.pair}>
        <section aria-labelledby={`${ids}-strengths`}>
          <h3 id={`${ids}-strengths`} className={styles.blockTitle}>
            {labels.strengthsTitle}
          </h3>
          {result.strengths.length > 0 ? (
            <ul className={styles.levers}>
              {result.strengths.map((axis) => (
                <li key={axis} className={styles.leverItem} data-tone="strength">
                  <h4 className={styles.leverTitle}>{axes[axis].title}</h4>
                  {finding(axis) && <p className={styles.text}>{finding(axis)}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.text}>{labels.noStrength}</p>
          )}
        </section>
        <section aria-labelledby={`${ids}-weak`}>
          <h3 id={`${ids}-weak`} className={styles.blockTitle}>
            {labels.weakTitle}
          </h3>
          {result.weak.length > 0 ? (
            <ul className={styles.levers}>
              {result.weak.map((axis) => (
                <li key={axis} className={styles.leverItem} data-tone="weak">
                  <h4 className={styles.leverTitle}>{axes[axis].title}</h4>
                  {finding(axis) && <p className={styles.text}>{finding(axis)}</p>}
                  <p className={styles.cost}>
                    <span className={styles.label}>{labels.costLabel}</span>
                    {levers[axis].costs[note(axis)]}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.text}>{labels.noWeak}</p>
          )}
        </section>
      </div>

      {/* 5. Commencer par */}
      <section className={styles.start} aria-labelledby={`${ids}-start`}>
        <div>
          <h3 id={`${ids}-start`} className={styles.blockTitle}>
            {labels.startTitle}
          </h3>
          <p className={styles.startLever}>{axes[start].title}</p>
          {action && (
            <div className={styles.action}>
              <p className={styles.label}>{labels.firstAction}</p>
              <p className={styles.actionText}>{action}</p>
              {actionNotes.map((text) => (
                <p key={text} className={styles.note}>
                  {text}
                </p>
              ))}
            </div>
          )}
          <p className={styles.report}>
            {labels.report.text}{' '}
            <a
              href={`#${formId}`}
              className={styles.reportLink}
              onClick={(event) => {
                // Défilement dans le plein écran, sans toucher à l'adresse de la page.
                event.preventDefault();
                document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {labels.report.link}
              <ArrowRightIcon size={16} className={styles.down} />
            </a>
          </p>
        </div>
        <div className={styles.startSide}>
          <p className={styles.label}>{labels.indicatorLabel}</p>
          <p className={styles.indicator}>{levers[start].indicator}</p>
          {profileNotes.map((text) => (
            <p key={text} className={styles.text}>
              {text}
            </p>
          ))}
          <p className={styles.label}>{labels.domainLabel}</p>
          <ul className={styles.domains}>
            {domainsOf(start).map((domain) => (
              <li key={domain.href}>
                <DomainLink domain={domain} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Votre rôle (aucune phrase pour « Autre fonction » : bloc masqué). */}
      {role && (
        <section aria-labelledby={`${ids}-role`}>
          <h3 id={`${ids}-role`} className={styles.blockTitle}>
            {labels.roleTitle}
          </h3>
          <p className={styles.roleText}>{role}</p>
        </section>
      )}

      {/* 7. Pour aller plus loin */}
      <section className={styles.more} aria-labelledby={`${ids}-more`}>
        <h3 id={`${ids}-more`} className={styles.blockTitle}>
          {labels.moreTitle}
        </h3>
        <div className={styles.moreGrid}>
          <ReportForm
            id={formId}
            labels={labels.form}
            fonction={fonction}
            payload={{ context, answers, profile: result.profile, total: result.total }}
          />
          <div className={styles.otherActions}>
            <Link
              to={consultantHref(labels.consultant, result, context, answers)}
              className={`btn btn-light ${styles.consultant}`}
            >
              {labels.consultant.label}
              <ArrowRightIcon size={20} className="arrow" />
            </Link>
            <button type="button" className={styles.textButton} onClick={onRetake}>
              {labels.retake}
            </button>
            <button type="button" className={styles.textButton} onClick={onReview}>
              {labels.restart}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Lien vers un domaine : dernier mot et flèche insécables. */
function DomainLink({ domain }: { domain: LinkType }) {
  const cut = domain.label.lastIndexOf(' ') + 1;
  return (
    <Link to={domain.href} className={styles.domainLink}>
      {domain.label.slice(0, cut)}
      <span className={styles.nowrap}>
        {domain.label.slice(cut)}
        <ArrowRightIcon size={16} className="arrow" />
      </span>
    </Link>
  );
}

/** Demande de rendez-vous : les réponses en paramètres, pour pré-remplir la demande. */
function consultantHref(
  link: LinkType,
  result: Result,
  context: ContextAnswers,
  answers: DiagnosticAnswers,
) {
  const params = new URLSearchParams({ source: 'autodiagnostic' });
  for (const [id, choice] of Object.entries(context)) params.set(id, choice);
  for (const [axis, choice] of Object.entries(answers)) params.set(axis, choice);
  params.set('profil', result.profile);
  params.set('maturite', String(result.percent));
  return `${link.href}?${params.toString()}`;
}

type ReportFormProps = {
  id: string;
  labels: Diagnostic['result']['form'];
  fonction: string;
  /** Réponses et résultat, joints à la demande pour composer le rapport. */
  payload: Record<string, unknown>;
};

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * Rapport détaillé contre coordonnées (le résultat affiché n'en dépend pas). Envoi à
 * `/api/rapport` : la confirmation ne s'affiche que si le serveur répond par un JSON valide ;
 * sinon, un message d'erreur.
 */
function ReportForm({ id, labels, fonction, payload }: ReportFormProps) {
  const ids = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    setStatus('sending');
    try {
      await http('/rapport', {
        method: 'POST',
        body: {
          contact: {
            name: field('name'),
            organisation: field('organisation'),
            fonction: field('fonction'),
            email: field('email'),
            phone: field('phone'),
            consultant: data.get('consultant') === 'on',
          },
          ...payload,
        },
      });
      setEmail(field('email'));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div id={id} className={styles.form}>
      <h4 className={styles.formTitle}>{labels.title}</h4>
      <p className={styles.formText}>{labels.text}</p>
      {status === 'done' ? (
        <p className={styles.formDone} role="status">
          {labels.done.replace('{email}', email)}
        </p>
      ) : (
        <form className={styles.fields} onSubmit={submit} aria-describedby={`${ids}-info`}>
          <Field id={`${ids}-name`} name="name" label={labels.name} autoComplete="name" />
          <Field
            id={`${ids}-organisation`}
            name="organisation"
            label={labels.organisation}
            autoComplete="organization"
          />
          <Field
            id={`${ids}-fonction`}
            name="fonction"
            label={labels.fonction}
            autoComplete="organization-title"
            defaultValue={fonction}
          />
          <Field
            id={`${ids}-email`}
            name="email"
            type="email"
            label={labels.email}
            autoComplete="email"
          />
          <Field
            id={`${ids}-phone`}
            name="phone"
            type="tel"
            label={labels.phone}
            optional={labels.optional}
            autoComplete="tel"
          />
          <label className={styles.consent}>
            <input type="checkbox" name="report" required />
            <span>{labels.consents[0]}</span>
          </label>
          <label className={styles.consent}>
            <input type="checkbox" name="consultant" />
            <span>{labels.consents[1]}</span>
          </label>
          {status === 'error' && (
            <p className={styles.formError} role="alert">
              {labels.error}
            </p>
          )}
          <button
            type="submit"
            className={`btn btn-primary ${styles.submit}`}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? labels.sending : labels.submit}
          </button>
          <p id={`${ids}-info`} className={styles.info}>
            {labels.info}
          </p>
        </form>
      )}
    </div>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  /** Mention « facultatif » ; sans elle, le champ est obligatoire. */
  optional?: string;
  autoComplete: string;
  defaultValue?: string;
};

function Field({
  id,
  name,
  label,
  type = 'text',
  optional,
  autoComplete,
  defaultValue,
}: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
        {optional && <span className={styles.optional}> ({optional})</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={!optional}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className={styles.input}
      />
    </div>
  );
}
