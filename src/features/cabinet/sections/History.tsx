import { useLanguage } from '@/i18n/useLanguage';
import type { CabinetContent } from '../content';
import { HistoryArt } from './HistoryArt';
import styles from './History.module.css';

/**
 * 02 « Notre histoire », sur blanc : surtitre (filet vert) et titre, puis le récit (HistoryArt).
 * Ordinateur : compteur d'années, légende et texte en trois actes à gauche, le tableau des six
 * domaines à droite, qui se construit au défilement. Tablette et téléphone : le texte, le
 * tableau, puis les repères empilés le long d'un filet vertical (point vert : 2025, le sixième
 * domaine, comme dans le tableau). La liste des repères reste dans la page sur ordinateur pour les lecteurs d'écran.
 */
export function History({ history }: { history: CabinetContent['history'] }) {
  const { lang } = useLanguage();

  return (
    <section className={styles.section} aria-labelledby="notre-histoire">
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow}>{history.eyebrow}</p>
          <h2 id="notre-histoire" className={styles.title} data-motion="title">
            {history.title}
          </h2>
        </div>

        <HistoryArt
          text={history.text}
          milestones={history.milestones}
          domains={history.domains}
          aiTag={history.aiTag}
          rtl={lang === 'ar'}
          alt={history.alt}
        />

        <ol className={styles.timeline}>
          {history.milestones.map((milestone, index) => (
            <li
              key={milestone.year}
              className={styles.milestone}
              data-current={index === 1 || undefined}
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
