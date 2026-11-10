import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useEffect, type RefObject } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';

/** Les effets ne tournent que dans un vrai navigateur, mouvement non réduit. */
export function motionAllowed() {
  return typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion();
}

/**
 * Écran où une section entière tient : elle s'y fige (ScrollTrigger pin) le temps que tout son
 * contenu apparaisse, puis la page passe à la suivante (réduit au besoin pour y tenir, voir
 * fitToScreen). Doit correspondre aux sections data-panel de CabinetPage.module.css.
 */
export const PANEL_QUERY = '(min-width: 64em) and (min-height: 34em)';

/**
 * Fait tenir un contenu figé dans la hauteur offerte : s'il dépasse (écran bas), il est réduit
 * juste ce qu'il faut (jusqu'à 60 %), centré depuis le haut, et une marge négative rend la place
 * gagnée ; recalculé à chaque redimensionnement, avant que ScrollTrigger mesure. Ne pas
 * l'appliquer à l'élément figé lui-même : à son contenu. Renvoie de quoi tout remettre en place.
 */
export function fitToScreen(content: HTMLElement, room: () => number) {
  const reset = () => {
    content.style.transform = '';
    content.style.transformOrigin = '';
    content.style.marginBottom = '';
  };
  const fit = () => {
    reset();
    const natural = content.offsetHeight;
    const available = room();
    if (natural <= available) return;
    const scale = Math.max(0.6, available / natural);
    content.style.transformOrigin = 'top center';
    content.style.transform = `scale(${scale})`;
    content.style.marginBottom = `${-natural * (1 - scale)}px`;
  };
  fit();
  ScrollTrigger.addEventListener('refreshInit', fit);
  return () => {
    ScrollTrigger.removeEventListener('refreshInit', fit);
    reset();
  };
}

/** La hauteur offerte au contenu d'une section figée : l'écran moins ses marges haute et basse. */
export const panelRoom = (section: HTMLElement) => () => {
  const style = getComputedStyle(section);
  return window.innerHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
};

/** Pour une section figée : le temps de défilement accordé (en % de la hauteur d'écran). */
export const panelPin = (trigger: Element, length: number) => ({
  trigger,
  start: 'top top',
  end: `+=${length}%`,
  scrub: 0.5,
  pin: true,
  anticipatePin: 1,
});

/**
 * Le mouvement de la page « Le cabinet » (GSAP : ScrollTrigger et SplitText), posé par
 * attributs dans les blocs, réglé en un seul endroit :
 * - data-motion="title"    : le titre monte ligne par ligne derrière un masque, une fois ;
 * - data-parallax         : la photo du cadre glisse doucement au défilement ;
 * - data-motion="unveil"   : le cadre se découvre de bas en haut, comme un rideau, une fois ;
 * - data-motion="words"    : les mots s'allument un à un au fil du défilement.
 * Sans script ou en mouvement réduit : tout est affiché, immobile. Le découpage du texte se
 * refait au redimensionnement (autoSplit) et se défait au démontage.
 */
export function useCabinetMotion(scope: RefObject<HTMLElement | null>, lang: string) {
  useEffect(() => {
    const root = scope.current;
    if (!root || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-motion="title"]').forEach((title) => {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.15,
              ease: 'expo.out',
              stagger: 0.1,
              scrollTrigger: { trigger: title, start: 'top 95%', once: true },
            }),
        });
      });

      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((frame) => {
        const image = frame.querySelector('img');
        if (!image) return;
        gsap.fromTo(
          image,
          { yPercent: -6, scale: 1.14 },
          {
            yPercent: 6,
            scale: 1.14,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>('[data-motion="unveil"]').forEach((frame, index) => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'expo.out',
            delay: (index % 3) * 0.12,
            scrollTrigger: { trigger: frame, start: 'top 95%', once: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>('[data-motion="words"]').forEach((text) => {
        SplitText.create(text, {
          type: 'words',
          aria: 'none', // des mots découpés se lisent tels quels ; pas d'aria-label sur un <p>
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.3 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: { trigger: text, start: 'top 95%', end: 'top 62%', scrub: 0.4 },
              },
            ),
        });
      });
    }, root);

    // Les découpes et les blocs figés allongent la page : on recalcule une fois tout posé.
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      ctx.revert();
    };
  }, [scope, lang]);
}
