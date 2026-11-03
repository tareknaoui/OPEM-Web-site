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
 * le titre) ; « S'inscrire » reste un lien à part. Ordinateur : 4 colonnes ; tablette : 2 ;
 * mobile : rangée de cartes qu'on fait glisser. Une seule session : une carte mise en avant, sur
 * toute la largeur (date | formation | inscription). Les sessions passées disparaissent
 * d'elles-mêmes ; les sessions intra-entreprise ne sont jamais affichées (sessionDates.ts).
 */
export function UpcomingSessions({ trainings }: { trainings: HomeContent['trainings'] }) {
  const { lang } = useLanguage();
  const sessions = upcomingSessions(trainings.items);
  // Une seule session : carte mise en avant, plutôt qu'une rangée de cartes vides.
  const featured = sessions.length === 1;

  const format = useMemo(() => {
    const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const number = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 });
    const full = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });
    // Le premier du mois s'écrit « 1er » en français.
    const first = lang === 'fr';
    return {
      day: (date: Date) => (first && date.getDate() === 1 ? '1er' : number.format(date.getDate())),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
      month: new Intl.DateTimeFormat(locale, { month: 'long' }),
      year: new Intl.DateTimeFormat(locale, { year: 'numeric' }),
      full: (date: Date) => {
        const text = full.format(date);
        return first && date.getDate() === 1 ? text.replace(/ 1 /, ' 1er ') : text;
      },
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
            data-featured={featured || undefined}
            data-reveal-stagger
            data-lenis-prevent-horizontal
          >
            {sessions.map((session) => (
              <li key={session.id} className={styles.card}>
                <div className={styles.top}>
                  <time dateTime={session.date} className={styles.date}>
                    <span className={styles.weekday} aria-hidden="true">
                      {format.weekday.format(session.day)}
                    </span>
                    <span className={styles.day} aria-hidden="true">
                      {format.day(session.day)}
                    </span>
                    <span className={styles.monthYear} aria-hidden="true">
                      <span className={styles.month}>{format.month.format(session.day)}</span>
                      <span>{format.year.format(session.day)}</span>
                    </span>
                    <span className="sr-only">{format.full(session.day)}</span>
                  </time>
                  <span className={styles.countdown}>{format.countdown(session.daysLeft)}</span>
                </div>

                <div className={styles.body}>
                  <p className={styles.topic}>{session.topic}</p>
                  <h3 className={styles.title}>
                    <Link to={session.href} className={styles.titleLink}>
                      {session.title}
                    </Link>
                  </h3>
                  <p className={styles.format}>{session.format}</p>
                </div>

                {/* Au-dessus du lien étiré du titre : il garde sa propre cible. Carte mise en
                    avant : un vrai bouton. */}
                <Link
                  to={`/contact?formation=${session.id}`}
                  className={
                    featured ? `btn btn-primary ${styles.registerButton}` : styles.register
                  }
                >
                  {trainings.register}
                  <span className="sr-only"> : {session.title}</span>
                  <ArrowRightIcon size={featured ? 18 : 16} className="arrow" />
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
