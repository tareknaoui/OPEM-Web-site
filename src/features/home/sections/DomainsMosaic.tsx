import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import styles from './DomainsMosaic.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * « Nos domaines », version mosaïque : tous les domaines visibles d'un coup, sans attente.
 * Sur fond bleu OPEM, cartes blanches entièrement cliquables (lien étiré sur le titre).
 * Ordinateur : 2 grandes cartes (photo | texte), puis les autres (photo au-dessus).
 * Mobile : liste compacte (vignette, titre, une phrase).
 * Photos sans texte dessus (charte) ; elles zooment légèrement au survol.
 * Disposition « rangee » (retenue) : pas de carte blanche, l'illustration posée sur le fond bleu
 * nuit de la section (le même que le sien : elle s'y fond), le texte en blanc dessous ;
 * 5 domaines → une ligne de 5, 6 domaines → deux lignes de 3. La grille s'adapte au nombre
 * de domaines (classes ci-dessous).
 * Disposition « coin » : la même rangée, sans grande image ; l'essentiel de l'illustration
 * (l'objet ambre) en vignette dans le coin de la carte, face au numéro.
 * Rangée et coin : texte en entier, puis les points du domaine (à partir de la tablette).
 */
export function DomainsMosaic({
  domains,
  layout = 'mosaique',
}: {
  domains: HomeContent['domains'];
  layout?: 'mosaique' | 'rangee' | 'coin';
}) {
  const count = domains.items.length;
  const gridClass = cx(
    styles.grid,
    layout !== 'mosaique' && styles.row,
    layout === 'coin' && styles.corner,
    layout === 'rangee' && styles.blend,
    // Tablette : la première carte prend toute la largeur seulement si le nombre est impair.
    count % 2 === 1 && styles.odd,
    // Plus de 5 domaines : la rangée passe sur deux lignes de 3.
    count > 5 && styles.twoRows,
    // Mosaïque : 2 grandes cartes puis 4 petites sur une ligne.
    layout === 'mosaique' && count === 6 && styles.fourSmall,
  );

  return (
    <section className={styles.section} aria-labelledby="domains-title">
      {/* Mobile : titre, domaines, puis le bouton ; ordinateur : bouton à côté du titre. */}
      <div className={cx('container', styles.layout)}>
        <h2 id="domains-title" className={styles.title} data-reveal="title">
          {domains.title}
        </h2>

        <ul className={gridClass} data-reveal-stagger>
          {domains.items.map((item, index) => (
            <li
              key={item.id}
              className={cx(styles.card, layout === 'mosaique' && index < 2 && styles.large)}
            >
              {layout === 'coin' ? null : layout === 'rangee' ? (
                // data-reveal="image" : l'illustration se découvre de bas en haut à son arrivée.
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
              ) : (
                <div className={styles.media}>
                  <img
                    className={styles.image}
                    src={item.image}
                    alt=""
                    width={1280}
                    height={960}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className={styles.body}>
                {layout === 'coin' ? (
                  <div className={styles.head}>
                    <span className={styles.number} aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <img
                      className={styles.emblem}
                      src={item.emblem}
                      alt=""
                      width={480}
                      height={480}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <span className={styles.number} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                )}
                <h3 className={styles.cardTitle}>
                  {/* Lien étiré sur toute la carte (::after) : un seul arrêt au clavier. */}
                  <Link to={item.href} className={styles.link}>
                    {item.title}
                  </Link>
                </h3>
                <p className={styles.text}>{item.text}</p>
                {layout !== 'mosaique' && (
                  <ul className={styles.points}>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                <span className={styles.discover} aria-hidden="true">
                  {domains.discover}
                  <ArrowRightIcon size={16} className="arrow" />
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Link to={domains.callback.href} className={cx('btn btn-light', styles.cta)} data-reveal>
          {domains.callback.label}
          <ArrowRightIcon size={18} className="arrow" />
        </Link>
      </div>
    </section>
  );
}
