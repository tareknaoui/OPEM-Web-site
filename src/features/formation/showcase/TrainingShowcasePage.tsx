import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { Link, useParams } from 'react-router';
import { useHideFooterCta } from '@/app/layouts/footer/useHideFooterCta';
import { ArrowRightIcon } from '@/components/icons';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { homeContent } from '@/features/home/content';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import FormationPage from '../FormationPage';
import { SHOWCASE_CONTACT, showcaseLabels, type TrainingShowcase } from './content';
import { asCard, fill, sessionDates } from './dates';
import { Illustration } from './Illustration';
import { RequestForm, type Wants } from './RequestForm';
import styles from './TrainingShowcasePage.module.css';
import { useAgenda, useShowcase } from './useFormations';

const REQUEST_ID = 'demande';
/**
 * Page d'une formation inter-entreprises (/formation/fiches-formation/<id>) : le modèle unique
 * retenu par OPEM (variante 4 « fond clair, scène bleu nuit »), le même pour chaque formation.
 * - Haut de page sur bleu très clair : fil d'Ariane, surtitre (cycle, format, ville),
 *   accroche (question, puis réponse surlignée en vert), titre, filet vert, promesse ; sur
 *   téléphone, les dates et le lieu en une ligne ; les deux boutons, qui mènent au formulaire
 *   et y cochent la demande choisie. À côté, une carte bleu nuit qui déborde sur la section
 *   suivante : l'illustration de la formation, son signal ambre animé sur le point clé, puis
 *   durée, dates, places et lieu.
 * - Pourquoi cette formation (et sa singularité, puis le lien « Confier… à nos consultants ») ;
 *   Vous repartez avec (trois acquis numérotés) ; sur un bandeau bleu très clair, Pour qui et
 *   Pourquoi OPEM ; OPEM en chiffres ; les témoignages propres à la formation, sur bleu nuit.
 * - Le formulaire de demande de la fiche technique détaillée et d'un devis (RequestForm).
 * - Le service formation, la référence et la mention de protection du contenu.
 * Le bandeau d'appel du pied de page est masqué : une seule action sur la page.
 * Une formation sans page garde l'ancien comportement (page « Formation qualifiante »,
 * descendue jusqu'à sa session). Les formations saisies dans WordPress (useFormations) ont la
 * même page ; en attendant la réponse de WordPress, la page reste vide un instant.
 */
export default function TrainingShowcasePage() {
  const { lang } = useLanguage();
  const { id } = useParams();
  const { item, ready } = useShowcase(lang, id);
  if (!item) return ready ? <FormationPage /> : <div className={styles.page} aria-busy="true" />;
  return <Showcase key={`${lang}-${item.id}`} item={item} />;
}

function Showcase({ item }: { item: TrainingShowcase }) {
  const { lang } = useLanguage();
  const t = showcaseLabels[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const requestRef = useRef<HTMLElement>(null);
  const [bar, setBar] = useState(false);
  const [wants, setWants] = useState<Wants>({ sheet: true, quote: false });
  useCabinetMotion(pageRef, lang);
  useHideFooterCta();

  const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
  const agenda = useAgenda(lang, homeContent[lang].trainings.items);
  const session = agenda.find((s) => s.id === item.id);
  const dates = session ? sessionDates(session.date, session.end, locale, t.range) : null;
  const seats = fill(t.facts.seatsValue, { n: item.seats });
  const where = `${item.place}, ${item.city}`;
  const [mainVoice, ...otherVoices] = item.voices;
  // Les autres sessions à venir de l'agenda (ni passées, ni réservées à un client), trois au plus.
  const today = new Date().toISOString().slice(0, 10);
  const related = agenda
    .filter((other) => other.id !== item.id && !other.intra && other.end >= today)
    .slice(0, 3);

  // La barre de la session : visible une fois le haut de page passé, jusqu'au formulaire.
  useEffect(() => {
    const hero = heroRef.current;
    const request = requestRef.current;
    if (!hero || !request || typeof IntersectionObserver === 'undefined') return;
    const update = () => {
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const beforeRequest = request.getBoundingClientRect().top > window.innerHeight * 0.85;
      setBar(pastHero && beforeRequest);
    };
    const observer = new IntersectionObserver(update, { threshold: [0, 0.15, 0.5, 1] });
    observer.observe(hero);
    observer.observe(request);
    return () => observer.disconnect();
  }, []);

  // Les deux boutons du haut : descendre au formulaire, la demande choisie déjà cochée.
  const ask = (want: keyof Wants) => (event: MouseEvent<HTMLAnchorElement>) => {
    setWants((current) => ({ ...current, [want]: true }));
    const target = document.getElementById(REQUEST_ID);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
  };

  // Une formation saisie dans WordPress peut laisser des champs vides : rien n'est alors affiché.
  const facts = [
    { label: t.facts.duration, value: item.duration },
    { label: t.facts.dates, value: dates ?? t.facts.noDate },
    { label: t.facts.seats, value: seats },
    { label: t.facts.place, value: where },
  ].filter((fact) => fact.value);

  return (
    <div ref={pageRef} className={styles.page}>
      <title>{`${item.title} · ${env.appName}`}</title>

      {/* ---------- Haut de page : le texte, et la scène bleu nuit qui déborde ---------- */}
      <section ref={heroRef} className={styles.hero} aria-labelledby={`${ids}-title`}>
        <div className={cx('container', styles.heroGrid)}>
          <div className={styles.heroText}>
            <nav aria-label={t.breadcrumb.label} className={styles.crumbs}>
              <ol>
                <li>
                  <Link to={t.breadcrumb.root.href}>{t.breadcrumb.root.label}</Link>
                </li>
                <li>
                  <Link to={t.breadcrumb.catalogue.href}>{t.breadcrumb.catalogue.label}</Link>
                </li>
                <li aria-current="page">{item.title}</li>
              </ol>
            </nav>
            <p className={styles.eyebrow}>{fill(t.format, { city: item.city })}</p>
            {/* L'accroche, juste au-dessus du titre : la première phrase lue. */}
            {(item.hook.question || item.hook.answer) && (
              <p className={styles.hook}>
                {item.hook.question}{' '}
                {item.hook.answer && (
                  <span className={styles.hookAnswer}>
                    <span>{item.hook.answer}</span>
                  </span>
                )}
              </p>
            )}
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {item.title}
            </h1>
            <span className={styles.titleBar} aria-hidden="true" />
            <p className={styles.promise}>{item.promise}</p>
            {/* Téléphone : la carte de la session vient plus bas ; les dates restent en vue. */}
            <p className={styles.heroWhen}>
              {dates ?? t.facts.noDate} · {where}
            </p>
            <div className={styles.actions}>
              <a href={`#${REQUEST_ID}`} className={styles.primary} onClick={ask('sheet')}>
                {t.actions.sheet}
                <ArrowRightIcon size={18} className="arrow" />
              </a>
              <a href={`#${REQUEST_ID}`} className={styles.secondary} onClick={ask('quote')}>
                {t.actions.quote}
              </a>
            </div>
          </div>

          <div className={styles.scene}>
            <div className={styles.sceneArt}>
              <Illustration item={item} />
            </div>
            <dl className={styles.facts} aria-label={t.facts.label}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Pourquoi cette formation ---------- */}
      <section
        className={cx('container', styles.split, styles.first)}
        aria-labelledby={`${ids}-why`}
      >
        <div className={styles.splitHead}>
          <h2 id={`${ids}-why`} className={styles.h2} data-reveal="title">
            {t.why}
          </h2>
        </div>
        <div className={styles.splitBody}>
          <p className={styles.lead}>{item.why.text}</p>
          {item.why.edge && (
            <p className={styles.edge} data-reveal>
              <b>{t.edge}</b> {item.why.edge}
            </p>
          )}
          {item.why.link && (
            <Link to={item.why.link.href} className={styles.more}>
              {item.why.link.label} ›
            </Link>
          )}
        </div>
      </section>

      {/* ---------- Vous repartez avec : trois cartes numérotées ---------- */}
      {item.gains.length > 0 && (
        <section className={cx('container', styles.gainsBlock)} aria-labelledby={`${ids}-gains`}>
          <h2 id={`${ids}-gains`} className={styles.h2} data-reveal="title">
            {t.gains}
          </h2>
          <ol className={styles.gains} data-reveal-stagger>
            {item.gains.map((gain, index) => (
              <li key={gain}>
                <span className={styles.gainNum} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{gain}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------- Pour qui ---------- */}
      {item.audience && (
        <section className={cx('container', styles.split)} aria-labelledby={`${ids}-audience`}>
          <div className={styles.splitHead}>
            <h2 id={`${ids}-audience`} className={styles.h2} data-reveal="title">
              {t.audience}
            </h2>
          </div>
          <p className={cx(styles.splitBody, styles.audience)}>{item.audience}</p>
        </section>
      )}

      {/* ---------- Pourquoi OPEM : trois raisons, puis les chiffres ---------- */}
      <section className={styles.band} aria-labelledby={`${ids}-reasons`}>
        <div className={cx('container', styles.bandInner)}>
          <div className={styles.bandHead}>
            <h2 id={`${ids}-reasons`} className={styles.h2} data-reveal="title">
              {t.reasons.title}
            </h2>
            <Link to={t.reasons.link.href} className={styles.more}>
              {t.reasons.link.label} ›
            </Link>
          </div>
          {item.reasons.length > 0 && (
            <ul className={styles.reasons} data-reveal-stagger>
              {item.reasons.map((reason) => (
                <li key={reason}>{asCard(reason)}</li>
              ))}
            </ul>
          )}
          <div className={styles.figuresBlock}>
            <h3 className="sr-only">{t.figures.label}</h3>
            <ul className={styles.figures} data-reveal-stagger>
              {t.figures.items.map((figure) => (
                <li key={figure.label}>
                  <b>{figure.value}</b>
                  <span>{figure.label}</span>
                </li>
              ))}
            </ul>
            <Link to={t.figures.link.href} className={styles.more}>
              {t.figures.link.label} ›
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Témoignages propres à la formation ---------- */}
      {mainVoice && (
        <section className={styles.voicesBand} aria-labelledby={`${ids}-voices`}>
          <div className={cx('container', styles.voicesInner)}>
            <h2 id={`${ids}-voices`} className="sr-only">
              {t.voices}
            </h2>
            <figure className={styles.voiceMain} data-reveal>
              <span className={styles.qmark} aria-hidden="true">
                «
              </span>
              <blockquote>
                <p>{mainVoice.quote}</p>
              </blockquote>
              <figcaption>{mainVoice.author}</figcaption>
            </figure>
            {otherVoices.length > 0 && (
              <div className={styles.voices} data-reveal-stagger>
                {otherVoices.map((voice) => (
                  <figure key={voice.quote} className={styles.voice}>
                    <blockquote>
                      <p>« {voice.quote} »</p>
                    </blockquote>
                    <figcaption>{voice.author}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Demande : la marche à suivre sur bleu nuit, le formulaire à côté ---------- */}
      <section
        id={REQUEST_ID}
        ref={requestRef}
        tabIndex={-1}
        className={cx('container', styles.request)}
        aria-labelledby={`${ids}-request`}
      >
        <div className={styles.requestPanel}>
          <h2 id={`${ids}-request`} className={styles.requestTitle} data-reveal="title">
            {t.request.title}
          </h2>
          <p>{t.request.intro}</p>
          <h3 className={styles.stepsTitle}>{t.steps.title}</h3>
          <ol className={styles.steps}>
            {t.steps.items.map((step, index) => (
              <li key={step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className={styles.requestContact}>
            {t.request.contact[0]}
            <a href={`mailto:${SHOWCASE_CONTACT.email}`} dir="ltr">
              {SHOWCASE_CONTACT.email}
            </a>
            {t.request.contact[1]}
            <a href={SHOWCASE_CONTACT.phone.href} dir="ltr">
              {SHOWCASE_CONTACT.phone.display}
            </a>
            {t.request.contact[2]}
          </p>
        </div>
        <RequestForm item={item} dates={dates} wants={wants} onWants={setWants} />
      </section>

      {/* ---------- D'autres formations à venir (agenda) ---------- */}
      {related.length > 0 && (
        <section className={cx('container', styles.related)} aria-labelledby={`${ids}-related`}>
          <div className={styles.relatedHead}>
            <h2 id={`${ids}-related`} className={styles.h2} data-reveal="title">
              {t.related.title}
            </h2>
            <Link to={t.related.all.href} className={styles.more}>
              {t.related.all.label} ›
            </Link>
          </div>
          <ul className={styles.relatedList} data-reveal-stagger>
            {related.map((other) => (
              <li key={other.id}>
                <Link to={other.href} className={styles.relatedCard}>
                  <span className={styles.relatedDate}>
                    {sessionDates(other.date, other.end, locale, t.range)}
                  </span>
                  <span className={styles.relatedTopic}>{other.topic}</span>
                  <span className={styles.relatedTitle}>{other.title}</span>
                  <span className={styles.relatedPromise}>{other.promise}</span>
                  <span className={styles.relatedMore}>
                    {t.related.more}
                    <ArrowRightIcon size={16} className="arrow" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Service formation, référence, protection du contenu ---------- */}
      <div className={cx('container', styles.colophon)}>
        <p>
          {t.service}{' '}
          <a href={SHOWCASE_CONTACT.phone.href} dir="ltr">
            {SHOWCASE_CONTACT.phone.display}
          </a>{' '}
          ·{' '}
          <a href={`mailto:${SHOWCASE_CONTACT.email}`} dir="ltr">
            {SHOWCASE_CONTACT.email}
          </a>
        </p>
        {item.reference && (
          <p>
            {t.reference}
            <span dir="ltr">{item.reference}</span>
          </p>
        )}
        <p className={styles.protection}>{t.protection}</p>
      </div>

      {/* ---------- La barre de la session : entre le haut de page et le formulaire ---------- */}
      <div
        className={cx(styles.bar, bar && styles.barShown)}
        aria-label={t.bar}
        role="region"
        inert={!bar}
        aria-hidden={!bar || undefined}
      >
        <div className={styles.barInner}>
          <p className={styles.barText}>
            <b>{item.title}</b>
            <span>
              {dates ?? t.facts.noDate} · {item.city} · {seats}
            </span>
          </p>
          <a href={`#${REQUEST_ID}`} className={styles.primary} onClick={ask('sheet')}>
            {t.actions.sheet}
            <ArrowRightIcon size={18} className="arrow" />
          </a>
          <a
            href={`#${REQUEST_ID}`}
            className={cx(styles.secondary, styles.barQuote)}
            onClick={ask('quote')}
          >
            {t.actions.quote}
          </a>
        </div>
      </div>
    </div>
  );
}
