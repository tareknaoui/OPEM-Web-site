import { ClockIcon } from '@phosphor-icons/react/dist/csr/Clock';
import { FileTextIcon } from '@phosphor-icons/react/dist/csr/FileText';
import { MapPinIcon } from '@phosphor-icons/react/dist/csr/MapPin';
import { UsersThreeIcon } from '@phosphor-icons/react/dist/csr/UsersThree';
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
import {
  findShowcase,
  SHOWCASE_CONTACT,
  showcaseLabels,
  type ShowcaseLabels,
  type TrainingShowcase,
} from './content';
import styles from './TrainingShowcasePage.module.css';

const REQUEST_ID = 'demande';
/** Ancres de la barre collée (même ordre que les blocs). */
const SECTIONS = ['pourquoi', 'temps-forts', 'emportez', 'public', 'temoignages'] as const;

/** Une date AAAA-MM-JJ, lue à midi pour éviter tout décalage de fuseau. */
const parse = (date: string) => new Date(`${date}T12:00:00`);

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

/**
 * Les dates d'une session : « 6 au 9 décembre » (le mois une seule fois s'il est le même),
 * puis l'année à part.
 */
function sessionDates(start: string, end: string, locale: string, pattern: string) {
  const from = parse(start);
  const to = parse(end);
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  const dayMonth = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' });
  const dayOnly = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const range = fill(pattern, {
    start: (sameMonth ? dayOnly : dayMonth).format(from),
    end: dayMonth.format(to),
  });
  return `${range} ${to.getFullYear()}`;
}

/** Le courriel de demande, prérempli avec la formation, la session et la référence. */
function requestHref(item: TrainingShowcase, t: ShowcaseLabels, dates: string | null) {
  const values = {
    title: item.title,
    ref: item.reference,
    session: dates ? fill(t.cta.mail.session, { dates }) : '',
  };
  const subject = encodeURIComponent(fill(t.cta.mail.subject, values));
  const body = encodeURIComponent(fill(t.cta.mail.body, values));
  return `mailto:${SHOWCASE_CONTACT.email}?subject=${subject}&body=${body}`;
}

/**
 * Page vitrine d'une formation inter-entreprises (/formation/fiches-formation/<id>), modèle
 * unique : version 10 « catalogue » retenue par OPEM (façon Cegos, ORSYS).
 * - Fil d'Ariane, puis deux colonnes sur ordinateur : à gauche le contenu, à droite un encadré
 *   « Prochaine session » qui reste à l'écran au défilement (dates de l'agenda, durée et
 *   horaires, effectif, lieu, référence, demande de fiche technique et de devis).
 * - À gauche : titre, sous-titre, accroche et étiquettes ; photo de session ; barre d'ancres
 *   collée sous le menu ; Pourquoi cette formation ; Quatre temps forts (index numéroté, le
 *   programme détaillé est envoyé sur demande) ; Ce que vous emportez ; Pour qui et prérequis,
 *   La session comprend ; témoignages (le premier en grand sur bleu nuit).
 * - En bas : OPEM en chiffres (bleu très clair), la demande (encadré bleu OPEM), la mention de
 *   protection du contenu.
 * Tablette et téléphone : une colonne, l'encadré « session » juste après le titre ; sur
 * téléphone, une barre fixe reprend la demande entre l'encadré et la demande du bas.
 * Le bandeau d'appel du pied de page est masqué : une seule action sur la page.
 * Une formation sans vitrine garde l'ancien comportement (page « Formation qualifiante »,
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
  const topActionRef = useRef<HTMLAnchorElement>(null);
  const requestRef = useRef<HTMLElement>(null);
  const [dock, setDock] = useState(false);
  useCabinetMotion(pageRef, lang);
  useHideFooterCta();

  const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
  const session = homeContent[lang].trainings.items.find((s) => s.id === item.id);
  const dates = session ? sessionDates(session.date, session.end, locale, t.range) : null;
  const mailto = requestHref(item, t, dates);
  const { practical } = item;
  const seats = fill(t.facts.seatsValue, { n: practical.seats });
  const [mainVoice, ...otherVoices] = item.voices;
  const tabLabels = [t.tabs.why, t.tabs.steps, t.tabs.gains, t.tabs.audience, t.tabs.voices];

  // Barre fixe (téléphone) : visible entre les deux demandes, une fois le bouton de l'encadré
  // passé et tant que l'encadré du bas n'est pas arrivé (ni dépassé : pas sur le pied de page).
  useEffect(() => {
    const top = topActionRef.current;
    const request = requestRef.current;
    if (!top || !request || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(() => {
      const pastTop = top.getBoundingClientRect().bottom < 0;
      const beforeRequest = request.getBoundingClientRect().top > window.innerHeight;
      setDock(pastTop && beforeRequest);
    });
    observer.observe(top);
    observer.observe(request);
    return () => observer.disconnect();
  }, []);

  const toSection = (targetId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
  };

  const sectionProps = (index: number) => ({
    id: SECTIONS[index],
    tabIndex: -1,
    'aria-labelledby': `${ids}-${SECTIONS[index]}`,
  });

  return (
    <div ref={pageRef} className={styles.page}>
      <title>{`${item.title} · ${env.appName}`}</title>

      <nav aria-label={t.breadcrumb.label} className={cx('container', styles.crumbs)}>
        <ol>
          <li>
            <Link to={t.breadcrumb.root.href}>{t.breadcrumb.root.label}</Link>
          </li>
          <li>{item.cycle}</li>
          <li aria-current="page">{item.title}</li>
        </ol>
      </nav>

      <div className={cx('container', styles.layout)}>
        <div className={styles.col}>
          {/* ---------- Ouverture ---------- */}
          <section className={styles.hero} aria-labelledby={`${ids}-title`}>
            <p className={styles.eyebrow}>{fill(t.format, { city: practical.city })}</p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {item.title}
            </h1>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.subtitle}>{item.subtitle}</p>
            <p className={styles.intro}>{item.intro}</p>
            <ul className={styles.tags} aria-label={t.tags.label}>
              <li>{t.tags.inter}</li>
              <li>{practical.mode}</li>
              <li>{practical.duration}</li>
              <li>{`${seats} ${t.facts.seatsMore}`}</li>
              <li>
                {t.reference} <span dir="ltr">{item.reference}</span>
              </li>
            </ul>
          </section>

          <figure className={styles.photo} data-motion="unveil">
            <img
              src={item.photo.small}
              srcSet={`${item.photo.small} 700w, ${item.photo.large} 1400w`}
              sizes="(min-width: 60em) 60vw, 100vw"
              alt={item.photo.alt}
              width={700}
              height={525}
              fetchPriority="high"
            />
          </figure>

          {/* ---------- Barre d'ancres ---------- */}
          <nav className={styles.tabs} aria-label={t.tabs.label}>
            <ul>
              {SECTIONS.map((section, index) => (
                <li key={section}>
                  <a href={`#${section}`} onClick={toSection(section)}>
                    {tabLabels[index]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Pourquoi cette formation ---------- */}
          <section className={styles.block} {...sectionProps(0)}>
            <p className={styles.eyebrow}>{t.why}</p>
            <h2 id={`${ids}-${SECTIONS[0]}`} className={styles.sectionTitle} data-motion="title">
              {item.why.title}
            </h2>
            <p className={styles.lead}>{item.why.lead}</p>
            <p>{item.why.text}</p>
          </section>

          {/* ---------- Quatre temps forts ---------- */}
          <section className={styles.block} {...sectionProps(1)}>
            <p className={styles.eyebrow}>{t.steps.eyebrow}</p>
            <h2 id={`${ids}-${SECTIONS[1]}`} className={styles.sectionTitle} data-motion="title">
              {item.stepsTitle}
            </h2>
            <ol className={styles.steps}>
              {item.steps.map((step, index) => (
                <li key={step.title}>
                  <span className={styles.stepNum} aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
            <p className={styles.note}>{t.steps.note}</p>
          </section>

          {/* ---------- Ce que vous emportez ---------- */}
          <section className={styles.block} {...sectionProps(2)}>
            <p className={styles.eyebrow}>{t.gains.eyebrow}</p>
            <h2 id={`${ids}-${SECTIONS[2]}`} className={styles.sectionTitle}>
              {t.gains.title}
            </h2>
            <ul className={styles.checks}>
              {item.gains.map((gain) => (
                <li key={gain}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.check}>
                    <circle cx="12" cy="12" r="10.5" />
                    <path d="M7 12.5l3.4 3.4L17 9" />
                  </svg>
                  <span>{gain}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Pour qui · La session comprend ---------- */}
          <section className={styles.block} {...sectionProps(3)}>
            <h2 id={`${ids}-${SECTIONS[3]}`} className="sr-only">
              {t.audienceHeading}
            </h2>
            <div className={styles.duo}>
              <div>
                <h3 className={styles.eyebrow}>{t.audience}</h3>
                <p>{item.audience.text}</p>
                <p className={styles.muted}>{item.audience.prerequisites}</p>
              </div>
              <div>
                <h3 className={styles.eyebrow}>{t.includes}</h3>
                <p>{item.includes.text}</p>
                <p className={styles.muted}>{item.includes.trainer}</p>
              </div>
            </div>
          </section>

          {/* ---------- Témoignages ---------- */}
          {mainVoice && (
            <section className={styles.block} {...sectionProps(4)}>
              <p className={styles.eyebrow}>{t.voices.eyebrow}</p>
              <h2 id={`${ids}-${SECTIONS[4]}`} className={styles.sectionTitle}>
                {t.voices.title}
              </h2>
              <figure className={cx(styles.voiceMain, 'on-dark')}>
                <span className={styles.qmark} aria-hidden="true">
                  «
                </span>
                <blockquote>
                  <p>{mainVoice.quote}</p>
                </blockquote>
                <figcaption>{mainVoice.author}</figcaption>
              </figure>
              {otherVoices.length > 0 && (
                <div className={styles.voices}>
                  {otherVoices.map((voice) => (
                    <figure key={voice.quote} className={styles.voice}>
                      <blockquote>
                        <p>{voice.quote}</p>
                      </blockquote>
                      <figcaption>{voice.author}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ---------- Encadré « session » ---------- */}
        <aside className={styles.card} aria-label={t.facts.label}>
          <p className={styles.cardLabel}>{t.card.next}</p>
          <p className={styles.cardDate}>{dates ?? t.facts.noDate}</p>
          <dl className={styles.cardFacts}>
            <div>
              <dt>
                <ClockIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.facts.duration}</span>
              </dt>
              <dd>
                <b>{practical.duration}</b>
                <span>{practical.hours}</span>
              </dd>
            </div>
            <div>
              <dt>
                <UsersThreeIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.facts.seats}</span>
              </dt>
              <dd>
                <b>{seats}</b>
                <span>{t.facts.seatsMore}</span>
              </dd>
            </div>
            <div>
              <dt>
                <MapPinIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.facts.place}</span>
              </dt>
              <dd>
                <b>{practical.place}</b>
                <span>{practical.city}</span>
              </dd>
            </div>
            <div>
              <dt>
                <FileTextIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.reference}</span>
              </dt>
              <dd>
                <b>
                  {t.reference} <span dir="ltr">{item.reference}</span>
                </b>
                <span>{t.card.refMore}</span>
              </dd>
            </div>
          </dl>
          <a
            ref={topActionRef}
            href={`#${REQUEST_ID}`}
            className={styles.primary}
            onClick={toSection(REQUEST_ID)}
          >
            {t.cta.button}
            <ArrowRightIcon size={18} className="arrow" />
          </a>
          <p className={styles.cardNote}>{t.card.note}</p>
          <p className={styles.cardContact}>
            <a href={SHOWCASE_CONTACT.phone.href} dir="ltr">
              {SHOWCASE_CONTACT.phone.display}
            </a>
            <a href={`mailto:${SHOWCASE_CONTACT.email}`} dir="ltr">
              {SHOWCASE_CONTACT.email}
            </a>
          </p>
        </aside>
      </div>

      {/* ---------- OPEM en chiffres ---------- */}
      <section className={styles.figures} aria-labelledby={`${ids}-figures`}>
        <div className="container">
          <h2 id={`${ids}-figures`} className={cx(styles.eyebrow, styles.eyebrowBlue)}>
            {t.figures.eyebrow}
          </h2>
          <dl className={styles.figureList} data-reveal-stagger>
            {t.figures.items.map((figure) => (
              <div key={figure.label} className={styles.figure}>
                <dt>{figure.label}</dt>
                <dd dir="ltr">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Demande de la fiche technique et du devis ---------- */}
      <div className="container">
        <section
          ref={requestRef}
          id={REQUEST_ID}
          className={cx(styles.request, 'on-dark')}
          aria-labelledby={`${ids}-request`}
          tabIndex={-1}
        >
          <div className={styles.requestText}>
            <h2 id={`${ids}-request`} className={styles.requestTitle}>
              {t.cta.title}
            </h2>
            <span className={styles.amberRule} aria-hidden="true" />
            <p>{fill(t.cta.text, { n: practical.seats })}</p>
          </div>
          <div className={styles.requestActions}>
            <a href={mailto} className={styles.light}>
              {t.cta.button}
              <ArrowRightIcon size={18} className="arrow" />
            </a>
            <p className={styles.contact}>
              <span>
                {t.cta.phone}{' '}
                <a href={SHOWCASE_CONTACT.phone.href} dir="ltr">
                  {SHOWCASE_CONTACT.phone.display}
                </a>
              </span>
              <span>
                {t.cta.email}{' '}
                <a href={`mailto:${SHOWCASE_CONTACT.email}`} dir="ltr">
                  {SHOWCASE_CONTACT.email}
                </a>
              </span>
              <span className={styles.reminder}>
                {fill(t.cta.reminder, { ref: '' })}
                <span dir="ltr">{item.reference}</span>
              </span>
            </p>
          </div>
        </section>

        <p className={styles.protection}>
          <span>{t.protection}</span>
          <span>
            {t.reference} <span dir="ltr">{item.reference}</span>
          </span>
        </p>
      </div>

      {/* Barre fixe (téléphone) */}
      <div className={cx(styles.dock, dock && styles.dockShown)} aria-hidden={!dock}>
        <a
          href={`#${REQUEST_ID}`}
          className={styles.primary}
          tabIndex={dock ? 0 : -1}
          onClick={toSection(REQUEST_ID)}
        >
          {t.cta.button}
        </a>
      </div>
    </div>
  );
}
