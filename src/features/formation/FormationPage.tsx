import { useEffect, useId, useRef, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { ContactBand } from '@/features/contact/ContactBand';
import { homeContent } from '@/features/home/content';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { formationContent } from './content';
import styles from './FormationPage.module.css';

/** Ancre de l'agenda (cible de « Catalogue et sessions » et des fiches formation du menu). */
const SESSIONS_ID = 'prochaines-sessions';
const sessionId = (id: string) => `session-${id}`;

/** Aujourd'hui, au format AAAA-MM-JJ (heure locale), pour masquer les sessions passées. */
const today = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Une date AAAA-MM-JJ, lue à midi pour éviter tout décalage de fuseau. */
const parse = (date: string) => new Date(`${date}T12:00:00`);

/**
 * Page « Formation qualifiante » (/formation), simple et engageante :
 * 01 En-tête : l'accroche du domaine (« Nos expertises ») en titre, le texte, l'agrément et le
 *    chiffre des personnes formées ; deux actions ; à côté, une grande photo de session.
 * 02 Les prochaines sessions : un agenda éditorial (grande date, thème, titre, promesse,
 *    format, « S'inscrire ») ; les sessions passées disparaissent d'elles-mêmes.
 * 03 Deux façons de vous former : sur mesure (intra) ou en session ouverte (inter), en photo.
 * 04 Ce qu'ils en disent : le témoignage « formation » en grand, à côté de trois photos.
 * Les rubriques du menu (/formation/catalogue-et-sessions, /formation/fiches-formation/…) mènent
 * à l'agenda (et, pour une fiche, à sa session). Sessions, photos, chiffre et témoignage : ceux
 * de l'accueil (homeContent) ; le reste : ./content.ts.
 */
export default function FormationPage() {
  const { lang } = useLanguage();
  const t = formationContent[lang];
  const home = homeContent[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);
  const { pathname } = useLocation();

  const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const month = new Intl.DateTimeFormat(locale, { month: 'short' });
  const full = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' });

  const now = today();
  const sessions = [...home.trainings.items]
    .filter((item) => (item.end ?? item.date) >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
  const trained = home.figures.items.find((figure) => figure.value === 1500);
  const quote = home.testimonials.quotes.find((q) => q.id === 'formation');
  const photos = home.trainings.photos;

  // Arrivée par une rubrique du menu : vers l'agenda, ou vers la session d'une fiche.
  useEffect(() => {
    if (!pathname.startsWith('/formation/')) return;
    const slug = pathname.match(/\/fiches-formation\/([^/]+)/)?.[1];
    const target =
      (slug && document.getElementById(sessionId(slug))) || document.getElementById(SESSIONS_ID);
    if (!target) return;
    const frame = requestAnimationFrame(() => scrollToElement(target));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const toSessions = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(SESSIONS_ID);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
  };

  return (
    <div ref={pageRef} key={lang} className={styles.page}>
      <title>{`${t.title} · ${env.appName}`}</title>

      {/* ---------- 01 En-tête ---------- */}
      <section className={styles.header} aria-labelledby={`${ids}-title`}>
        <div className={cx('container', styles.headerGrid)}>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>{t.header.eyebrow}</p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {t.header.title}
            </h1>
            <p className={styles.lead}>{t.header.lead}</p>
            <div className={styles.actions}>
              <a href={`#${SESSIONS_ID}`} className={styles.primary} onClick={toSessions}>
                {t.header.actions.sessions}
                <ArrowRightIcon size={18} className="arrow" />
              </a>
              <Link to={t.header.actions.custom.href} className={styles.secondary}>
                {t.header.actions.custom.label}
              </Link>
            </div>
            <div className={styles.proofs}>
              {trained && (
                <p className={styles.proof}>
                  <span className={styles.proofValue}>
                    {trained.prefix}
                    {trained.value.toLocaleString(locale)}
                  </span>
                  <span className={styles.proofLabel}>{trained.label}</span>
                </p>
              )}
              <p className={styles.approval}>{t.header.approval}</p>
            </div>
          </div>
          <div className={styles.headerPhoto} data-motion="unveil">
            <img
              src={t.header.image.small}
              srcSet={`${t.header.image.small} 700w, ${t.header.image.large} 1400w`}
              sizes="(min-width: 64em) 45vw, 92vw"
              alt={t.header.image.alt}
              width={700}
              height={525}
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* ---------- 02 Les prochaines sessions ---------- */}
      <section
        id={SESSIONS_ID}
        className={styles.sessions}
        aria-labelledby={`${ids}-sessions`}
        tabIndex={-1}
      >
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.sessions.eyebrow}</p>
            <h2 id={`${ids}-sessions`} className={styles.sectionTitle} data-motion="title">
              {t.sessions.title}
            </h2>
            <p className={styles.sectionLead}>{t.sessions.lead}</p>
          </header>

          {sessions.length > 0 ? (
            <ol className={styles.agenda}>
              {sessions.map((item) => {
                const start = parse(item.date);
                const end = item.end ? parse(item.end) : start;
                const range = home.trainings.range
                  .replace('{start}', full.format(start))
                  .replace('{end}', full.format(end));
                return (
                  <li key={item.id} id={sessionId(item.id)} className={styles.session}>
                    <time className={styles.date} dateTime={item.date}>
                      <span className={styles.day}>{day.format(start)}</span>
                      <span className={styles.month}>{month.format(start)}</span>
                    </time>
                    <div className={styles.sessionBody}>
                      <p className={styles.topic}>
                        {item.topic}
                        {item.isNew && (
                          <span className={styles.new}>{home.trainings.newBadge}</span>
                        )}
                      </p>
                      <h3 className={styles.sessionTitle}>{item.title}</h3>
                      <p className={styles.promise}>{item.promise}</p>
                      <p className={styles.meta}>
                        <span>{range}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.format}</span>
                      </p>
                    </div>
                    <Link
                      to={t.sessions.register.href}
                      className={styles.register}
                      aria-label={`${t.sessions.register.label} : ${item.title}`}
                    >
                      {t.sessions.register.label}
                      <ArrowRightIcon size={18} className="arrow" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className={styles.empty}>
              {home.trainings.empty.text}{' '}
              <Link to={home.trainings.empty.link.href}>{home.trainings.empty.link.label}</Link>
            </p>
          )}
          <p className={styles.note}>{t.sessions.note}</p>
        </div>
      </section>

      {/* ---------- 03 Deux façons de vous former ---------- */}
      <section className={styles.formats} aria-labelledby={`${ids}-formats`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.formats.eyebrow}</p>
            <h2 id={`${ids}-formats`} className={styles.sectionTitle} data-motion="title">
              {t.formats.title}
            </h2>
          </header>
          <ul className={styles.formatList}>
            {t.formats.items.map((item) => (
              <li key={item.id} className={styles.format}>
                <div className={styles.formatPhoto}>
                  <img
                    src={item.image.small}
                    srcSet={`${item.image.small} 700w, ${item.image.large} 1400w`}
                    sizes="(min-width: 48em) 45vw, 92vw"
                    alt={item.image.alt}
                    width={700}
                    height={525}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className={styles.formatTitle}>{item.title}</h3>
                <p className={styles.formatText}>{item.text}</p>
                <ul className={styles.points}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 04 Ce qu'ils en disent ---------- */}
      {quote && (
        <section className={styles.voices} aria-labelledby={`${ids}-voices`}>
          <div className={cx('container', styles.voicesGrid)}>
            <figure className={styles.quote}>
              <p className={styles.eyebrow}>{t.voices.eyebrow}</p>
              <h2 id={`${ids}-voices`} className={styles.voicesTitle}>
                {t.voices.title}
              </h2>
              <blockquote className={styles.quoteText}>
                <p>{quote.quote}</p>
              </blockquote>
              <figcaption className={styles.quoteAuthor}>{quote.author}</figcaption>
            </figure>
            <ul className={styles.photos} aria-label={t.voices.photosLabel}>
              {photos.map((photo) => (
                <li key={photo.src} className={styles.photo}>
                  <img
                    src={photo.src.replace('.webp', '-700.webp')}
                    alt={photo.alt}
                    width={700}
                    height={525}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- 05 Premier échange ---------- */}
      <ContactBand />
    </div>
  );
}
