import { CheckIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import { CommitmentPictogram } from '../icons';
import { ProvisionalNote } from './SectionHeader';
import styles from './Commitments.module.css';

/**
 * « Ce qui nous distingue », juste sous l'accroche : sur bleu très clair, trois cartes blanches
 * (équipes autonomes, confidentialité, spécialistes du terrain). Chaque carte : pictogramme,
 * grand numéro en contour, engagement, preuves cochées, puis ce qu'on trouve souvent ailleurs.
 * Un filet vert en haut de carte s'étire au survol.
 */
export function Commitments({ commitments }: { commitments: HomeContent['commitments'] }) {
  return (
    <section className={`on-surface ${styles.section}`} aria-labelledby="commitments-title">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow" data-reveal>
              {commitments.eyebrow}
            </p>
            <h2 id="commitments-title" className="h2" data-reveal="title">
              {commitments.title}
            </h2>
          </div>
          <p className={styles.lead} data-reveal>
            {commitments.lead}
          </p>
        </div>

        <ol className={styles.list} data-reveal-stagger>
          {commitments.items.map((item, index) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.top}>
                <span className={styles.icon} aria-hidden="true">
                  <CommitmentPictogram name={item.icon} size={28} />
                </span>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>

              <p className={styles.label}>{commitments.proofLabel}</p>
              <ul className={styles.proofs}>
                {item.proofs.map((proof) => (
                  <li key={proof}>
                    <CheckIcon size={18} className={styles.check} />
                    {proof}
                  </li>
                ))}
              </ul>

              <p className={styles.elsewhere}>
                <span className={styles.elsewhereLabel}>{commitments.elsewhereLabel}</span>{' '}
                {item.elsewhere}
              </p>
            </li>
          ))}
        </ol>

        <ProvisionalNote show={commitments.provisional}>{commitments.note}</ProvisionalNote>
      </div>
    </section>
  );
}
