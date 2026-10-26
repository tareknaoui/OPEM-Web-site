import { useEffect } from 'react';

const SELECTOR = '[data-reveal]:not([data-visible]), [data-reveal-stagger]:not([data-visible])';

/**
 * Apparitions au défilement, pour tout le site : un seul observateur repère les éléments
 * marqués data-reveal (fondu et montée ; « title » : le titre se précise ; « image » : la
 * photo se découvre) ou data-reveal-stagger (les enfants montent l'un après l'autre), et
 * leur pose data-visible une seule fois. Les effets sont en CSS (styles/global.css) : rien
 * ne se recalcule pendant le défilement. Les éléments ajoutés plus tard (changement de
 * page ou de maquette) sont pris en compte.
 */
export function useScrollReveal() {
  useEffect(() => {
    const pending = new Set<Element>();
    const show = (element: Element) => {
      (element as HTMLElement).dataset.visible = '';
      pending.delete(element);
      observer?.unobserve(element);
    };

    // Navigateur sans IntersectionObserver : tout est affiché directement.
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              const shown = entries.filter((entry) => entry.isIntersecting);
              if (!shown.length) return;
              shown.forEach((entry) => show(entry.target));
              // Saut de page (touche Fin, lien d'ancre) : ce qui est resté au-dessus de
              // l'écran sans jamais le croiser apparaît aussi.
              pending.forEach((element) => {
                if (element.getBoundingClientRect().bottom < 0) show(element);
              });
            },
            { rootMargin: '0px 0px -12% 0px' },
          );

    let frame = 0;
    const scan = () => {
      frame = 0;
      document.querySelectorAll(SELECTOR).forEach((element) => {
        if (!observer) return show(element);
        pending.add(element);
        observer.observe(element);
      });
    };
    scan();

    const mutations = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer?.disconnect();
    };
  }, []);
}
