import { useLanguage } from '@/i18n/useLanguage';
import type { CabinetContent } from '../content';
import { HistoryArt } from './HistoryArt';
import styles from './History.module.css';

/**
 * 02 « Notre histoire », sur blanc : surtitre (filet vert) et titre, puis le récit (HistoryArt).
 * Ordinateur : le texte en trois actes, chacun au-dessus de son pilier dans la frise dessinée,
 * qui se construit au défilement. Tablette et téléphone : le texte, puis les repères empilés le
 * long d'un filet vertical. La liste des repères reste dans la page sur ordinateur pour les
 * lecteurs d'écran.
 */
export function History({ history }: { history: CabinetContent['history'] }) {
  const { lang } = useLanguage();
  const last = history.milestones.length - 1;

  return (
    <section className={styles.section} aria-labelledby="notre-histoire">
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow}>{history.eyebrow}</p>
          <h2 id="notre-histoire" className={styles.title} data-motion="title">
            {history.title}
          </h2>
        </div>

        <HistoryArt text={history.text} milestones={history.milestones} rtl={lang === 'ar'} />

        <ol className={styles.timeline}>
          {history.milestones.map((milestone, index) => (
            <li
              key={milestone.year}
              className={styles.milestone}
              data-current={index === last || undefined}
            >
              <time className={styles.year} dateTime={milestone.year}>
                {milestone.year}
              </time>
              <span className={styles.label}>{milestone.title}</span>
              <span className={styles.detail}>{milestone.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
