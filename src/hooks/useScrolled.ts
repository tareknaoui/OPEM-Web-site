import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/**
 * Indique si la page a défilé au-delà d'un seuil (en pixels).
 * Le composant ne se ré-affiche que quand la réponse change (vrai ↔ faux),
 * pas à chaque pixel de défilement.
 */
export function useScrolled(threshold = 8) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
