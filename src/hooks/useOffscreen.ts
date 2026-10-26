import { useCallback } from 'react';

/**
 * Pose data-offscreen sur l'élément tant qu'il n'est pas dans la partie centrale de
 * l'écran (aucun re-rendu React). Sert à mettre en pause un défilement automatique que
 * personne ne regarde : il reprend quand la section revient à l'écran.
 */
export function useOffscreen<T extends HTMLElement>() {
  return useCallback((element: T | null) => {
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => element.toggleAttribute('data-offscreen', !entry?.isIntersecting),
      { rootMargin: '-20% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
}
