import type { HomeContent } from '../content';
import { CommitmentPictogram } from '../icons';
import { ProvisionalNote } from './SectionHeader';
import styles from './CommitmentsEssential.module.css';

/**
 * « Ce qui nous distingue », version « L'essentiel » (retenue) : sur bleu très clair, un titre
 * court centré puis trois engagements, chacun en un grand pictogramme, quelques mots et une
 * phrase. Ordinateur : trois colonnes séparées d'un filet. Mobile : une ligne par engagement.
 * La version détaillée (preuves, « Ailleurs, souvent ») reste dans Commitments.tsx.
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
                <h3 className={styles.title}>{item.short.title}</h3>
                <p className={styles.text}>{item.short.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.note}>
          <ProvisionalNote show={commitments.provisional}>{commitments.note}</ProvisionalNote>
        </div>
      </div>
    </section>
  );
}
