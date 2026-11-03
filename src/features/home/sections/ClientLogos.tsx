import type { CSSProperties } from 'react';
import type { ClientLogo, HomeContent } from '../content';
import styles from './ClientLogos.module.css';

/** Exemplaires de la rangée : le premier lu, les autres décoratifs. */
const COPIES = [0, 1, 2];

/**
 * Hauteur d'affichage d'un logo, pour un poids visuel égal : les logos larges sont moins hauts,
 * les logos carrés plus hauts (la surface reste à peu près la même).
 */
const displayHeight = ({ width, height }: ClientLogo) =>
  Math.round(Math.min(56, Math.max(26, 54 / Math.sqrt(width / height))));

/**
 * Bandeau « Ils nous font confiance », juste sous l'accroche : un petit titre, puis une rangée de
 * logos qui défile sans fin, bords estompés. Logos en gris pour qu'ils s'accordent, en couleur
 * au survol ; survol ou focus mettent le défilement en pause ; en mouvement réduit, les logos sont
 * posés, immobiles. La rangée est répétée pour boucler sans raccord, même sur un très grand écran
 * (elle avance d'un exemplaire sur trois) : les copies sont masquées aux lecteurs d'écran.
 */
export function ClientLogos({ clients }: { clients: HomeContent['clients'] }) {
  return (
    <section className={styles.section} aria-labelledby="clients-title">
      <div className={`container ${styles.band}`}>
        <h2 id="clients-title" className={styles.title}>
          {clients.title}
        </h2>
        <div className={styles.marquee}>
          <div className={styles.track}>
            {COPIES.map((copy) => (
              <ul key={copy} className={styles.list} aria-hidden={copy > 0 || undefined}>
                {clients.items.map((item) => (
                  <li key={item.logo} className={styles.item}>
                    <img
                      className={styles.logo}
                      src={`/images/clients/${item.logo}.webp`}
                      alt={copy > 0 ? '' : item.name}
                      title={item.name}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      style={{ '--h': displayHeight(item) } as CSSProperties}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
