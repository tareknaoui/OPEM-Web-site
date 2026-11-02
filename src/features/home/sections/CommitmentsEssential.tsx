import type { HomeContent } from '../content';
import { CommitmentPictogram } from '../icons';
import styles from './CommitmentsEssential.module.css';

/**
 * « Ce qui nous distingue » (« Pourquoi choisir OPEM ») : sur bleu très clair, un titre centré
 * puis trois engagements, chacun en un grand pictogramme, un titre et un court texte.
 * Ordinateur : trois colonnes séparées d'un filet. Mobile : un engagement sous l'autre.
 */
export function CommitmentsEssential({ commitments }: { commitments: HomeContent['commitments'] }) {
  return (
    <section className={`on-surface ${styles.section}`} aria-labelledby="commitments-title">
      <div className="container">
        <div className={styles.header}>
          <p className="eyebrow" data-reveal>
            {commitments.eyebrow}
          </p>
          <h2 id="commitments-title" className={`h2 ${styles.heading}`} data-reveal="title">
            <span className={styles.headingLead}>{commitments.heading[0]}</span>{' '}
            <span className={styles.headingAccent}>{commitments.heading[1]}</span>
          </h2>
        </div>

        <ul className={styles.list} data-reveal-stagger>
          {commitments.items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">
                <CommitmentPictogram name={item.icon} size={30} />
              </span>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
