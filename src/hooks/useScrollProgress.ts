import { useEffect, useEffectEvent, type RefObject } from 'react';

type Options = {
  /** Ligne de départ (fraction de la hauteur de l'écran) : le haut de l'élément la passe → 0. */
  start?: number;
  /** Ligne d'arrivée : le bas de l'élément la passe → 1. */
  end?: number;
};

/**
 * Avancement d'un élément pendant le défilement, de 0 à 1. onProgress est appelé au plus une
 * fois par image (requestAnimationFrame), sans re-rendu React : l'appelant écrit lui-même
 * dans le DOM (variable CSS, attribut). Fonctionne avec le défilement doux (Lenis fait
 * défiler la fenêtre).
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (progress: number, element: T) => void,
  { start = 0.85, end = 0.5 }: Options = {},
) {
  const update = useEffectEvent(onProgress);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const from = window.innerHeight * start;
      const distance = Math.max(rect.height + from - window.innerHeight * end, 1);
      update(Math.min(Math.max((from - rect.top) / distance, 0), 1), element);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, start, end]);
}
