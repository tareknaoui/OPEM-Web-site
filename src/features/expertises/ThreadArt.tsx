import { useEffect, useRef, useState } from 'react';
import styles from './ExpertisesPage.module.css';

/*
 * Bloc 05, tracé au trait : un fil d'abord emmêlé (« Votre situation ») se déploie en une ligne
 * droite qui mène à un point (« Premier pas »), puis à une flèche (« Cap »). Le fil se trace
 * quand le bloc arrive à l'écran ; image fixe, entièrement dessinée, si moins d'animations est
 * demandé ou sans script. Couleurs sur fond clair : bleu nuit, bleu OPEM, point vert ; pas d'ambre.
 */

const THREAD =
  'M 40 214 C 18 150, 112 118, 122 170 C 130 216, 58 232, 70 182 C 82 130, 172 140, 162 192 ' +
  'C 154 236, 94 216, 116 176 C 138 136, 204 160, 194 206 C 186 242, 138 232, 150 200 ' +
  'C 162 170, 214 188, 236 200 L 384 200';

export function ThreadArt({
  marks,
  alt,
}: {
  marks: { situation: string; step: string; course: string };
  alt: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!svg || reduce || typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={styles.thread}
      viewBox="0 0 560 320"
      role="img"
      aria-label={alt}
      data-drawn={drawn ? '' : undefined}
    >
      <path d={THREAD} pathLength={1} className={styles.threadPath} />
      <circle cx="398" cy="200" r="11" className={styles.threadStep} />
      <path
        d="M 420 200 L 518 200 M 500 184 L 520 200 L 500 216"
        pathLength={1}
        className={styles.threadArrow}
      />
      <g className={styles.threadMarks} aria-hidden="true">
        <text x="112" y="282" textAnchor="middle">
          {marks.situation}
        </text>
        <text x="398" y="168" textAnchor="middle">
          {marks.step}
        </text>
        <text x="500" y="168" textAnchor="middle">
          {marks.course}
        </text>
      </g>
    </svg>
  );
}
