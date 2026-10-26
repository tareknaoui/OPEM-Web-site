import { useCallback } from 'react';

/**
 * Apparition discrète à l'arrivée à l'écran (fondu + léger glissement, défini en CSS
 * sur [data-reveal]). À utiliser avec `ref={reveal}` et l'attribut `data-reveal`.
 * Aucun re-rendu React : l'attribut data-visible est posé directement, une seule fois.
 */
export function useReveal<T extends HTMLElement>() {
  return useCallback((element: T | null) => {
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      element.dataset.visible = '';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.visible = '';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
}
