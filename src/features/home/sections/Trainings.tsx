import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/i18n/useLanguage';
import type { HomeContent } from '../content';
import { ProvisionalNote, SectionHeader } from './SectionHeader';
import styles from './Trainings.module.css';

type Session = HomeContent['trainings']['items'][number];

/** Sessions à venir (aujourd'hui compris), triées par date. */
function upcoming(items: Session[], today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return items
    .map((item) => ({ ...item, day: new Date(`${item.date}T12:00:00`) }))
    .filter((item) => item.day.getTime() >= start)
    .sort((a, b) => a.day.getTime() - b.day.getTime());
}

/**
 * Prochaines formations, en liste de type agenda : date en grand à gauche,
 * titre et format au centre, bouton à droite.
 */
export function Trainings({ trainings }: { trainings: HomeContent['trainings'] }) {
  const { lang } = useLanguage();
  const reveal = useReveal<HTMLOListElement>();
  const sessions = upcoming(trainings.items);

  const dates = useMemo(() => {
    const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    return {
      day: new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }),
      month: new Intl.DateTimeFormat(locale, { month: 'short' }),
      year: new Intl.DateTimeFormat(locale, { year: 'numeric' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
    };
  }, [lang]);

  return (
    <section className="section" aria-labelledby="trainings-title">
      <div className="container">
        <SectionHeader
          id="trainings-title"
          eyebrow={trainings.eyebrow}
          title={trainings.title}
          aside={
            <Link to={trainings.all.href} className={styles.all}>
              {trainings.all.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          }
        />

        {sessions.length === 0 ? (
          <p className={styles.empty}>{trainings.empty}</p>
        ) : (
          <ol ref={reveal} data-reveal className={styles.agenda}>
            {sessions.map((session) => (
              <li key={session.id} className={styles.session}>
                <time dateTime={session.date} className={styles.date}>
                  <span className={styles.day} aria-hidden="true">
                    {dates.day.format(session.day.getDate())}
                  </span>
                  <span className={styles.month} aria-hidden="true">
                    {dates.month.format(session.day)} {dates.year.format(session.day)}
                  </span>
                  <span className="sr-only">{dates.full.format(session.day)}</span>
                </time>

                <div className={styles.info}>
                  <h3 className={styles.title}>
                    <Link to={session.href} className={styles.titleLink}>
                      {session.title}
                    </Link>
                  </h3>
                  <p className={styles.format}>{session.format}</p>
                </div>

                <Link to="/contact" className={`btn btn-primary ${styles.register}`}>
                  {trainings.register}
                  <span className="sr-only"> : {session.title}</span>
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
