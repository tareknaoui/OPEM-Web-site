import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Fait glisser une liste de nombres vers de nouvelles valeurs (décélération douce), image par
 * image : sert à déformer le radar de l'autodiagnostic. `initial` : valeurs de départ au premier
 * affichage (zéros pour faire « pousser » la forme). En mouvement réduit, valeurs finales directes.
 */
export function useTweened(
  target: readonly number[],
  duration: number,
  initial: readonly number[] = target,
): readonly number[] {
  const [values, setValues] = useState(initial);
  const current = useRef(initial);
  const key = target.join(' ');
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced || typeof requestAnimationFrame !== 'function') return;
    const goal = key.split(' ').map(Number);
    const origin = current.current;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = goal.map((value, index) => {
        const from = origin[index] ?? 0;
        return from + (value - from) * eased;
      });
      current.current = next;
      setValues(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [key, duration, reduced]);

  return reduced ? target : values;
}
