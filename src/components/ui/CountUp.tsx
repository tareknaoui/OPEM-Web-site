import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';

type CountUpProps = {
  value: number;
  format: (value: number) => string;
  durationMs?: number;
  className?: string;
};

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Nombre qui compte de 0 à sa valeur quand il arrive à l'écran.
 * - La valeur finale est rendue d'emblée (lisible sans JavaScript, par les moteurs, en test).
 * - Le texte animé est masqué aux lecteurs d'écran, qui lisent directement la valeur finale.
 * - Aucune animation si l'utilisateur demande moins de mouvement.
 */
export function CountUp({ value, format, durationMs = 1600, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

    let frame = 0;
    element.textContent = format(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          element.textContent = format(Math.round(value * easeOutCubic(progress)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = format(value);
    };
  }, [value, format, durationMs]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
