import { useReveal } from '@/hooks/useReveal';
import type { HomeContent } from '../content';
import { ProvisionalNote } from './SectionHeader';
import styles from './Sectors.module.css';

/**
 * Secteurs : rangée de pastilles. Sur téléphone, la rangée défile horizontalement
 * (zone atteignable au clavier pour pouvoir la faire défiler aux flèches).
 * Composition inversée par rapport aux sections voisines : titre à droite.
 */
export function Sectors({ sectors }: { sectors: HomeContent['sectors'] }) {
  const revealText = useReveal<HTMLDivElement>();
  const revealList = useReveal<HTMLDivElement>();

  return (
    <section className={`section ${styles.section}`} aria-labelledby="sectors-title">
      <div className="container grid-12">
        <div ref={revealText} data-reveal className={styles.text}>
          <p className="eyebrow">{sectors.eyebrow}</p>
          <h2 id="sectors-title" className="h2">
            {sectors.title}
          </h2>
          <p className="lead">{sectors.lead}</p>
        </div>

        <div ref={revealList} data-reveal className={styles.pillsArea}>
          <div
            className={styles.scroller}
            role="region"
            aria-label={sectors.listLabel}
            tabIndex={0}
          >
            <ul className={styles.pills}>
              {sectors.items.map((sector) => (
                <li key={sector} className={styles.pill}>
                  {sector}
                </li>
              ))}
            </ul>
          </div>
          <ProvisionalNote show={sectors.provisional}>{sectors.note}</ProvisionalNote>
        </div>
      </div>
    </section>
  );
}
