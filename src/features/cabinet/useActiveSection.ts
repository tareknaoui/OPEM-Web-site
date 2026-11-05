import { useEffect, useState } from 'react';

/**
 * Rubrique en cours de lecture : la dernière section (celle qui contient le titre `id`) dont
 * le haut a passé le tiers de l'écran. null tant qu'aucune ne l'a atteint (en-tête de page).
 * Mesuré au plus une fois par image pendant le défilement.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(' ');

  useEffect(() => {
    const list = key.split(' ');
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of list) {
        const heading = document.getElementById(id);
        const section = heading?.closest('section') ?? heading;
        if (section && section.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
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
  }, [key]);

  return active;
}
