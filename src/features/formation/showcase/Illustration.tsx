import { useEffect, useRef, type CSSProperties, type PointerEvent } from 'react';
import { ARTWORK } from './art';
import type { TrainingShowcase } from './content';
import styles from './TrainingShowcasePage.module.css';

/**
 * L'illustration animée d'une formation, dans la carte bleu nuit du haut de page.
 * - Avec une image (illustration.image) : un lent travelling (zoom et glissement), un léger
 *   effet de profondeur qui suit la souris, des paquets lumineux qui parcourent les flux de
 *   l'image, et le signal ambre posé sur son point clé ; les bords se fondent dans la carte.
 * - Sinon : le dessin vectoriel animé pièce par pièce (art/*.tsx) et le signal ambre.
 * Le nom accessible est porté par le conteneur ; le reste est masqué aux lecteurs d'écran.
 * Mouvement réduit demandé : les animations CSS s'arrêtent (feuille de style), les paquets
 * SMIL sont mis en pause ici et la profondeur ne suit plus la souris.
 */
export function Illustration({ item }: { item: TrainingShowcase }) {
  const ref = useRef<HTMLDivElement>(null);
  const { alt, signal, image, flows = [] } = item.illustration;
  const Art = ARTWORK[item.id];
  const position = { '--x': `${signal.x}%`, '--y': `${signal.y}%` } as CSSProperties;

  useEffect(() => {
    const svg = ref.current?.querySelector('svg');
    if (!svg || typeof svg.pauseAnimations !== 'function') return;
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => (query.matches ? svg.pauseAnimations() : svg.unpauseAnimations());
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [item.id]);

  // Profondeur : la scène glisse un peu à l'opposé du pointeur (souris seulement).
  const follow = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width - 0.5) * 2;
    const py = ((event.clientY - box.top) / box.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--px', px.toFixed(3));
    event.currentTarget.style.setProperty('--py', py.toFixed(3));
  };
  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--px', '0');
    event.currentTarget.style.setProperty('--py', '0');
  };

  if (image) {
    return (
      <div
        ref={ref}
        className={styles.photoArt}
        style={position}
        role="img"
        aria-label={alt}
        onPointerMove={follow}
        onPointerLeave={reset}
      >
        <div className={styles.depth}>
          <div className={styles.travel}>
            <img src={image.src} alt="" width={image.width} height={image.height} />
            <svg
              className={styles.flows}
              viewBox={`0 0 ${image.width} ${image.height}`}
              aria-hidden="true"
              focusable="false"
            >
              {flows.flatMap((path, index) =>
                [0, 1].map((wave) => {
                  const dur = 2.6 + (index % 3) * 0.4;
                  const begin = `${(index * 0.55 + wave * dur * 0.5).toFixed(2)}s`;
                  return (
                    <circle key={`${index}-${wave}`} r="3" fill="#ffffff" opacity="0">
                      <animateMotion
                        path={path}
                        dur={`${dur}s`}
                        begin={begin}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.15;0.8;1"
                        dur={`${dur}s`}
                        begin={begin}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                }),
              )}
            </svg>
            <span className={styles.signal} aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.art} style={position} role="img" aria-label={alt}>
      <div ref={ref} className={styles.artSvg}>
        {Art && <Art />}
      </div>
      <span className={styles.signal} aria-hidden="true" />
    </div>
  );
}
