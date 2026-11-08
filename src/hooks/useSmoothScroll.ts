import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

/**
 * Défilement fluide à la molette (Lenis) : la page glisse au lieu d'avancer par à-coups.
 * Le défilement reste celui du navigateur (barre, clavier, position sticky, liens d'ancre) ;
 * au doigt, rien ne change. Désactivé si l'utilisateur a demandé moins d'animations.
 * - Menus en fenêtre (<dialog>) : défilement natif à l'intérieur, page figée derrière.
 * - Zones marquées data-lenis-prevent(-horizontal) : laissées au navigateur (rail de cartes).
 */
let current: Lenis | null = null;

/**
 * Descend en douceur jusqu'à un élément, en laissant au-dessus la marge prévue par son
 * scroll-margin-top (le menu reste visible à l'arrivée). Passe par Lenis quand il est actif ;
 * sinon, défilement du navigateur (instantané si moins d'animations est demandé).
 */
export function scrollToElement(target: HTMLElement) {
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  if (current) {
    current.scrollTo(target, { offset: -margin, duration: 1.1 });
    return;
  }
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function useSmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      prevent: (node) => node.nodeName === 'DIALOG',
    });
    current = lenis;
    return () => {
      current = null;
      lenis.destroy();
    };
  }, []);
}
