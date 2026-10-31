import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import type { HomeContent } from '../content';
import { ProvisionalNote } from './SectionHeader';
import styles from './UpcomingSessions.module.css';
import { upcomingSessions } from './sessionDates';

/**
 * « Les prochaines sessions », entre le bandeau IA et les éclairages : sur bleu très clair,
 * une carte-calendrier par session (grande date, compte à rebours calculé, thème, titre,
 * format, lien d'inscription). Toute la carte mène à la fiche de la formation (lien étiré sur
 * le titre) ; « S'inscrire », discret, reste un lien à part. Ordinateur : 4 colonnes ;
 * tablette : 2 ; mobile : rangée de cartes qu'on fait glisser. Les sessions passées
 * disparaissent d'elles-mêmes.
 */
export function UpcomingSessions({ trainings }: { trainings: HomeContent['trainings'] }) {
  const { lang } = useLanguage();
  const sessions = upcomingSessions(trainings.items);

  const format = useMemo(() => {
    const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return {
      day: new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }),
      month: new Intl.DateTimeFormat(locale, { month: 'long' }),
      year: new Intl.DateTimeFormat(locale, { year: 'numeric' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
      // « Dans 19 jours », « Demain », « Aujourd'hui » (majuscule initiale en français).
      countdown: (days: number) => {
        const text = relative.format(days, 'day');
        return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
      },
    };
  }, [lang]);

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
          <p className={styles.empty}>{trainings.empty}</p>
        ) : (
          <ol
            className={styles.list}
            aria-label={trainings.listLabel}
            data-reveal-stagger
            data-lenis-prevent-horizontal
          >
            {sessions.map((session) => (
              <li key={session.id} className={styles.card}>
                <div className={styles.top}>
                  <time dateTime={session.date} className={styles.date}>
                    <span className={styles.day} aria-hidden="true">
                      {format.day.format(session.day.getDate())}
                    </span>
                    <span className={styles.monthYear} aria-hidden="true">
                      <span className={styles.month}>{format.month.format(session.day)}</span>
                      <span>{format.year.format(session.day)}</span>
                    </span>
                    <span className="sr-only">{format.full.format(session.day)}</span>
                  </time>
                  <span className={styles.countdown}>{format.countdown(session.daysLeft)}</span>
                </div>

                <p className={styles.topic}>{session.topic}</p>
                <h3 className={styles.title}>
                  <Link to={session.href} className={styles.titleLink}>
                    {session.title}
                  </Link>
                </h3>
                <p className={styles.format}>{session.format}</p>

                {/* Lien discret, au-dessus du lien étiré du titre : il garde sa propre cible. */}
                <Link to={`/contact?formation=${session.id}`} className={styles.register}>
                  {trainings.register}
                  <span className="sr-only"> : {session.title}</span>
                  <ArrowRightIcon size={16} className="arrow" />
                </Link>
              </li>
            ))}
          </ol>
        )}

        <ProvisionalNote show={trainings.provisional}>{trainings.note}</ProvisionalNote>
      </div>
    </section>
  );
}
