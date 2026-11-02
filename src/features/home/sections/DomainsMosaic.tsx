import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import styles from './DomainsMosaic.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * « Nos domaines » : tous les domaines visibles d'un coup, sans attente, en rangée. Sur le fond
 * bleu nuit de la section, chaque illustration s'y fond (même bleu), le texte en blanc dessous,
 * puis les points du domaine (à partir de la tablette). Cartes entièrement cliquables (lien
 * étiré sur le titre). La grille s'adapte au nombre de domaines : 5 domaines → une ligne de 5,
 * 6 domaines → deux lignes de 3.
 */
export function DomainsMosaic({ domains }: { domains: HomeContent['domains'] }) {
  const count = domains.items.length;
  const gridClass = cx(
    styles.grid,
    styles.row,
    styles.blend,
    // Tablette : la première carte prend toute la largeur seulement si le nombre est impair.
    count % 2 === 1 && styles.odd,
    // Plus de 5 domaines : la rangée passe sur deux lignes de 3.
    count > 5 && styles.twoRows,
  );

  return (
    <section className={styles.section} aria-labelledby="domains-title">
      {/* Mobile : titre, domaines, puis le bouton ; ordinateur : bouton à côté du titre. */}
      <div className={cx('container', styles.layout)}>
        <div className={styles.heading}>
          <p className={styles.eyebrow} data-reveal>
            {domains.eyebrow}
          </p>
          <h2 id="domains-title" className={styles.title} data-reveal="title">
            {domains.title}
          </h2>
        </div>

        <ul className={gridClass} data-reveal-stagger>
          {domains.items.map((item, index) => (
            <li key={item.id} className={styles.card}>
              {/* data-reveal="image" : l'illustration se découvre de bas en haut à son arrivée. */}
              <div className={cx(styles.media, styles.framed)} data-reveal="image">
                <img
                  className={styles.image}
                  src={item.illustration}
                  srcSet={`${item.illustration.replace(/\.webp$/, '-800.webp')} 800w, ${item.illustration} 1376w`}
                  sizes="(min-width: 64em) 30vw, (min-width: 48em) 45vw, 100vw"
                  alt=""
                  width={1376}
                  height={768}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.body}>
                <span className={styles.number} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <h3 className={styles.cardTitle}>
                  {/* Lien étiré sur toute la carte (::after) : un seul arrêt au clavier. */}
                  <Link to={item.href} className={styles.link}>
                    {item.title}
                  </Link>
                </h3>
                <p className={styles.text}>{item.text}</p>
                <ul className={styles.points}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className={styles.discover} aria-hidden="true">
                  {item.discover ?? domains.discover}
                  <ArrowRightIcon size={16} className="arrow" />
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Link to={domains.all.href} className={cx('btn btn-light', styles.cta)} data-reveal>
          {domains.all.label}
          <ArrowRightIcon size={18} className="arrow" />
        </Link>
      </div>
    </section>
  );
}
