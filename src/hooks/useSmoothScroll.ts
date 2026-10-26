import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

/**
 * Défilement fluide à la molette (Lenis) : la page glisse au lieu d'avancer par à-coups.
 * Le défilement reste celui du navigateur (barre, clavier, position sticky, liens d'ancre) ;
 * au doigt, rien ne change. Désactivé si l'utilisateur a demandé moins d'animations.
 * - Menus en fenêtre (<dialog>) : défilement natif à l'intérieur, page figée derrière.
 * - Zones marquées data-lenis-prevent(-horizontal) : laissées au navigateur (rail de cartes,
 *   panneau des maquettes).
 */
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
    return () => lenis.destroy();
  }, []);
}
