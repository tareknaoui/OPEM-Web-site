import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './EtudesPage.module.css';

/*
 * Bloc 01, image abstraite : un nuage de points gris, dispersés sur tout le panneau bleu nuit,
 * qui se resserre lentement jusqu'à un seul point ambre (l'information qui compte), seule touche
 * d'ambre du bloc. Le mouvement part quand le panneau arrive à l'écran ; si l'appareil demande
 * moins d'animations (ou sans script), l'image est fixe, nuage déjà resserré.
 */

const W = 600;
const H = 440;
/** Le point ambre : un peu à droite du centre, là où l'œil termine sa lecture. */
const TARGET = { x: 372, y: 226 };
const COUNT = 260;

/** Hasard reproductible : le même nuage à chaque affichage (et au rendu serveur). */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

type Point = { x: number; y: number; dx: number; dy: number; r: number; o: number; d: number };

const POINTS: Point[] = (() => {
  const next = random(20261102);
  return Array.from({ length: COUNT }, () => {
    const x = 12 + next() * (W - 24);
    const y = 12 + next() * (H - 24);
    // Chaque point parcourt une part différente du chemin : le nuage se resserre en un amas
    // dense autour du point ambre, plus lâche vers les bords.
    const keep = 0.1 + next() ** 1.25 * 0.72;
    return {
      x,
      y,
      dx: (TARGET.x - x) * (1 - keep),
      dy: (TARGET.y - y) * (1 - keep),
      r: 1.6 + next() * 2.4,
      o: 0.35 + next() * 0.55,
      d: next() * 1.6,
    };
  });
})();

export function PointCloud({ alt }: { alt: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!svg || reduce || typeof IntersectionObserver === 'undefined') {
      setMoving(true); // image fixe : le nuage s'affiche déjà resserré
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMoving(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={styles.cloud}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={alt}
      data-moving={moving ? '' : undefined}
    >
      {POINTS.map((point, index) => (
        <circle
          key={index}
          className={styles.dot}
          cx={point.x}
          cy={point.y}
          r={point.r}
          style={
            {
              '--dx': `${point.dx}px`,
              '--dy': `${point.dy}px`,
              '--delay': `${point.d}s`,
              opacity: point.o,
            } as CSSProperties
          }
        />
      ))}
      <circle className={styles.halo} cx={TARGET.x} cy={TARGET.y} r="22" />
      <circle className={styles.target} cx={TARGET.x} cy={TARGET.y} r="9" />
    </svg>
  );
}
