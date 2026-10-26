import { useCallback } from 'react';

/**
 * Précharge des images quand l'élément approche de l'écran (environ un écran avant) :
 * téléchargées et décodées d'avance, elles s'affichent sans blanc quand on change de
 * diapositive ou d'onglet. À utiliser avec `ref={preload}` sur la section.
 */
export function usePreloadImages<T extends HTMLElement>(sources: readonly string[]) {
  const list = sources.join('\n');

  return useCallback(
    (element: T | null) => {
      if (!element) return;

      const preload = () => {
        for (const src of list.split('\n')) {
          const image = new Image();
          image.decoding = 'async';
          image.src = src;
          image.decode?.().catch(() => {
            // Image indisponible : elle sera simplement chargée à l'affichage.
          });
        }
      };

      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          preload();
          observer.disconnect();
        },
        { rootMargin: '100% 0px' },
      );
      observer.observe(element);
      return () => observer.disconnect();
    },
    [list],
  );
}
