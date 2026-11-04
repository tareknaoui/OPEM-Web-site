import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import type { HomeContent } from '../content';
import { ProvisionalNote } from './SectionHeader';
import styles from './UpcomingSessions.module.css';
import { upcomingSessions } from './sessionDates';

/** Le bloc montre au plus les cinq sessions les plus proches ; la photo prend la case suivante. */
const MAX_SESSIONS = 5;

/**
 * « Les prochaines sessions », entre le bandeau IA et les éclairages : sur bleu très clair,
 * une carte-calendrier par session (grand jour de début et mois, dates « du … au … », compte à
 * rebours, catégorie, titre court, promesse, format, bouton « S'inscrire »), dans l'ordre des
 * dates, puis une photo réelle d'une session dans la dernière case. Ordinateur : 3 colonnes
 * (3 cartes, puis 2 cartes et la photo) ; tablette : 2 ; mobile : rangée de cartes qu'on fait
 * glisser. Toute la carte mène à la fiche de la formation (lien étiré sur le titre) ;
 * « S'inscrire » mène directement à sa partie « Inscription ». Une première édition (`isNew`)
 * est mise en avant : carte bleu nuit et badge « Nouveau ». Les sessions passées disparaissent
 * d'elles-mêmes ; les sessions intra-entreprise ne sont jamais affichées (sessionDates.ts).
 */
export function UpcomingSessions({ trainings }: { trainings: HomeContent['trainings'] }) {
  const { lang } = useLanguage();
  const sessions = upcomingSessions(trainings.items).slice(0, MAX_SESSIONS);

  const format = useMemo(() => {
    const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const number = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 });
    const plain = new Intl.NumberFormat(locale);
    const month = new Intl.DateTimeFormat(locale, { month: 'long' });
    const monthYear = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    // Le premier du mois s'écrit « 1er » en français.
    const first = lang === 'fr';
    const day = (date: Date) =>
      first && date.getDate() === 1 ? '1er' : plain.format(date.getDate());
    const fill = (start: string, end: string) =>
      trainings.range.replace('{start}', start).replace('{end}', end);
    return {
      bigDay: (date: Date) => number.format(date.getDate()),
      monthYear: (date: Date) => monthYear.format(date),
      // « du 6 au 9 décembre » ; à cheval sur deux mois : « du 28 novembre au 2 décembre ».
      range: (start: Date, end: Date) =>
        fill(
          start.getMonth() === end.getMonth() ? day(start) : `${day(start)} ${month.format(start)}`,
          `${day(end)} ${month.format(end)}`,
        ),
      // Lecteurs d'écran : « du dimanche 6 au mercredi 9 décembre 2026 ».
      fullRange: (start: Date, end: Date) =>
        fill(
          `${weekday.format(start)} ${day(start)}${
            start.getMonth() === end.getMonth() ? '' : ` ${month.format(start)}`
          }`,
          `${weekday.format(end)} ${day(end)} ${monthYear.format(end)}`,
        ),
      // « Dans 19 jours », « Demain », « Aujourd'hui » (majuscule initiale en français).
      countdown: (days: number) => {
        const text = relative.format(days, 'day');
        return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
      },
    };
  }, [lang, trainings.range]);

  return (
    <section className={`on-surface ${styles.section}`} aria-labelledby="sessions-title">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow" data-reveal>
              {trainings.eyebrow}
            </p>
            <h2 id="sessions-title" className="h2" data-reveal="title">
              {trainings.title}
            </h2>
          </div>
          <Link to={trainings.all.href} className={styles.all} data-reveal>
            {trainings.all.label}
            <ArrowRightIcon size={18} className="arrow" />
          </Link>
        </div>

        {sessions.length === 0 ? (
          <p className={styles.empty}>
            {trainings.empty.text}{' '}
            <Link to={trainings.empty.link.href} className={styles.emptyLink}>
              {trainings.empty.link.label}
            </Link>
          </p>
        ) : (
          <ol
            className={styles.list}
            aria-label={trainings.listLabel}
            data-count={sessions.length}
            data-reveal-stagger
            data-lenis-prevent-horizontal
          >
            {sessions.map((session) => (
              <li key={session.id} className={styles.card} data-new={session.isNew || undefined}>
                <div className={styles.top}>
                  <time dateTime={session.date} className={styles.date}>
                    <span className={styles.day} aria-hidden="true">
                      {format.bigDay(session.day)}
                    </span>
                    <span className={styles.when} aria-hidden="true">
                      <span className={styles.monthYear}>{format.monthYear(session.day)}</span>
                      <span className={styles.range}>
                        {format.range(session.day, session.lastDay)}
                      </span>
                    </span>
                    <span className="sr-only">
                      {format.fullRange(session.day, session.lastDay)}
                    </span>
                  </time>
                  {session.isNew && <span className={styles.badge}>{trainings.newBadge}</span>}
                  <span className={styles.countdown}>{format.countdown(session.daysLeft)}</span>
                </div>

                <div className={styles.body}>
                  <p className={styles.topic}>{session.topic}</p>
                  <h3 className={styles.title}>
                    <Link to={session.href} className={styles.titleLink}>
                      {session.title}
                    </Link>
                  </h3>
                  <p className={styles.promise}>{session.promise}</p>
                  <p className={styles.format}>{session.format}</p>
                </div>

                {/* Au-dessus du lien étiré du titre : il mène à la partie « Inscription » de la
                    fiche (formulaire en ligne et bulletin à télécharger). */}
                <Link
                  to={`${session.href}#inscription`}
                  className={`btn ${session.isNew ? 'btn-light' : 'btn-primary'} ${styles.register}`}
                >
                  {trainings.register}
                  <span className="sr-only"> : {session.title}</span>
                  <ArrowRightIcon size={16} className="arrow" />
                </Link>
              </li>
            ))}
            {/* Photo réelle d'une session OPEM, toujours dans la dernière case. */}
            <li className={styles.photo} aria-hidden={trainings.photo.src ? undefined : true}>
              {trainings.photo.src ? (
                <img src={trainings.photo.src} alt={trainings.photo.alt} loading="lazy" />
              ) : (
                <PhotoPlaceholder />
              )}
            </li>
          </ol>
        )}

        <ProvisionalNote show={trainings.provisional}>{trainings.note}</ProvisionalNote>
      </div>
    </section>
  );
}

/** En attendant la photo de l'album OPEM : une salle de formation esquissée, sans texte. */
function PhotoPlaceholder() {
  return (
    <svg className={styles.placeholder} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
      <rect x="48" y="56" width="200" height="120" rx="8" />
      <circle cx="300" cy="120" r="28" />
      <path d="M252 230a48 48 0 0 1 96 0" />
      <circle cx="120" cy="214" r="18" />
      <path d="M88 280a32 32 0 0 1 64 0" />
      <circle cx="200" cy="214" r="18" />
      <path d="M168 280a32 32 0 0 1 64 0" />
    </svg>
  );
}
