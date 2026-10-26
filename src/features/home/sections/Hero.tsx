import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import { MarkerPictogram } from '../icons';
import styles from './Hero.module.css';
import { NetworkCanvas } from './NetworkCanvas';

type HeroProps = { hero: HomeContent['hero']; markers: HomeContent['markers'] };

/**
 * Bandeau d'accueil en écran partagé : texte sur 7 colonnes, réseau 3D sur bleu nuit
 * sur 5 colonnes (jusqu'au bord de l'écran). Pas d'animation d'apparition ici :
 * le titre est le plus grand élément de la page et doit s'afficher immédiatement.
 */
export function Hero({ hero, markers }: HeroProps) {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.text}>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="h1 rule">
            {hero.title}
          </h1>
          <p className={`lead ${styles.subtitle}`}>{hero.subtitle}</p>
          <div className={styles.actions}>
            <Link to={hero.primary.href} className="btn btn-primary">
              {hero.primary.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
            <Link to={hero.secondary.href} className="btn btn-secondary">
              {hero.secondary.label}
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <NetworkCanvas className={styles.canvas} />
        </div>
      </section>

      <HeroMarkers markers={markers} />
    </>
  );
}

/** Bande des 3 repères sous le bandeau d'accueil (partagée par les deux maquettes). */
export function HeroMarkers({ markers }: { markers: HomeContent['markers'] }) {
  return (
    <div className={styles.markers}>
      <ul className={`container ${styles.markerList}`}>
        {markers.map((marker) => (
          <li key={marker.icon} className={styles.marker}>
            <MarkerPictogram name={marker.icon} size={22} className={styles.markerIcon} />
            {marker.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
