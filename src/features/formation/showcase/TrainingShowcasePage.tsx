import { useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
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
import { findShowcase, SHOWCASE_CONTACT, showcaseLabels, type TrainingShowcase } from './content';
import { fill, sessionDates } from './dates';
import { RequestForm, type Wants } from './RequestForm';
import styles from './TrainingShowcasePage.module.css';

const REQUEST_ID = 'demande';
/**
 * Page d'une formation inter-entreprises (/formation/fiches-formation/<id>) : le modèle unique
 * retenu par OPEM (variante 4 « fond clair, scène bleu nuit »), le même pour chaque formation.
 * - Haut de page sur bleu très clair quadrillé : fil d'Ariane, surtitre (cycle, format, ville),
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
 * descendue jusqu'à sa session).
 */
export default function TrainingShowcasePage() {
  const { lang } = useLanguage();
  const { id } = useParams();
  const item = findShowcase(lang, id);
  if (!item) return <FormationPage />;
  return <Showcase key={`${lang}-${item.id}`} item={item} />;
}

function Showcase({ item }: { item: TrainingShowcase }) {
  const { lang } = useLanguage();
  const t = showcaseLabels[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  const [wants, setWants] = useState<Wants>({ sheet: true, quote: false });
  useCabinetMotion(pageRef, lang);
  useHideFooterCta();

  const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
  const session = homeContent[lang].trainings.items.find((s) => s.id === item.id);
  const dates = session ? sessionDates(session.date, session.end, locale, t.range) : null;
  const seats = fill(t.facts.seatsValue, { n: item.seats });
  const where = `${item.place}, ${item.city}`;
  const [mainVoice, ...otherVoices] = item.voices;
  const signal = {
    '--x': `${item.illustration.signal.x}%`,
    '--y': `${item.illustration.signal.y}%`,
  } as CSSProperties;

  // Les deux boutons du haut : descendre au formulaire, la demande choisie déjà cochée.
  const ask = (want: keyof Wants) => (event: MouseEvent<HTMLAnchorElement>) => {
    setWants((current) => ({ ...current, [want]: true }));
    const target = document.getElementById(REQUEST_ID);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
  };

  const facts = [
    { label: t.facts.duration, value: item.duration },
    { label: t.facts.dates, value: dates ?? t.facts.noDate },
    { label: t.facts.seats, value: seats },
    { label: t.facts.place, value: where },
  ];

  return (
    <div ref={pageRef} className={styles.page}>
      <title>{`${item.title} · ${env.appName}`}</title>

      {/* ---------- Haut de page : le texte, et la scène bleu nuit qui déborde ---------- */}
      <section className={styles.hero} aria-labelledby={`${ids}-title`}>
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
            <p className={styles.eyebrow}>
              {fill(t.format, { cycle: item.cycle, city: item.city })}
            </p>
            <p className={styles.hook}>
              {item.hook.question}{' '}
              <span className={styles.hookAnswer}>
                <span>{item.hook.answer}</span>
              </span>
            </p>
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
              <div className={styles.art} style={signal}>
                <img
                  src={item.illustration.src}
                  alt={item.illustration.alt}
                  width={572}
                  height={388}
                  fetchPriority="high"
                />
                <span className={styles.signal} aria-hidden="true" />
              </div>
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
          <p className={styles.edge}>
            <b>{t.edge}</b> {item.why.edge}
          </p>
          <Link to={item.why.link.href} className={styles.more}>
            {item.why.link.label} ›
          </Link>
        </div>
      </section>

      {/* ---------- Vous repartez avec ---------- */}
      <section className={cx('container', styles.split)} aria-labelledby={`${ids}-gains`}>
        <div className={styles.splitHead}>
          <h2 id={`${ids}-gains`} className={styles.h2} data-reveal="title">
            {t.gains}
          </h2>
        </div>
        <ol className={cx(styles.splitBody, styles.gains)} data-reveal-stagger>
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

      {/* ---------- Pour qui · Pourquoi OPEM ---------- */}
      <div className={styles.band}>
        <div className={cx('container', styles.bandGrid)}>
          <section aria-labelledby={`${ids}-audience`}>
            <h2 id={`${ids}-audience`} className={styles.h3} data-reveal="title">
              {t.audience}
            </h2>
            <p>{item.audience}</p>
          </section>
          <section aria-labelledby={`${ids}-reasons`}>
            <h2 id={`${ids}-reasons`} className={styles.h3} data-reveal="title">
              {t.reasons.title}
            </h2>
            <ul className={styles.reasons}>
              {item.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <Link to={t.reasons.link.href} className={styles.more}>
              {t.reasons.link.label} ›
            </Link>
          </section>
        </div>
      </div>

      {/* ---------- OPEM en chiffres ---------- */}
      <section className={cx('container', styles.figuresBlock)} aria-labelledby={`${ids}-figures`}>
        <h2 id={`${ids}-figures`} className="sr-only">
          {t.figures.label}
        </h2>
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

      {/* ---------- Demande de la fiche technique et du devis ---------- */}
      <section
        id={REQUEST_ID}
        tabIndex={-1}
        className={cx('container', styles.request)}
        aria-labelledby={`${ids}-request`}
      >
        <div className={styles.requestText}>
          <h2 id={`${ids}-request`} className={styles.h2} data-reveal="title">
            {t.request.title}
          </h2>
          <p>{t.request.intro}</p>
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
        <p>
          {t.reference}
          <span dir="ltr">{item.reference}</span>
        </p>
        <p className={styles.protection}>{t.protection}</p>
      </div>
    </div>
  );
}
