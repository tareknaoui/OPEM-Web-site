import { useEffect, useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import type { HomeContent } from '../content';
import styles from './Approach.module.css';

/**
 * « Notre approche » en défilement collant : à gauche, le titre reste fixe pendant que
 * les 3 étapes défilent à droite, avec un grand numéro et une barre de progression verte.
 * La progression est écrite directement en CSS (--progress) : aucun re-rendu React au défilement.
 */
export function Approach({ approach }: { approach: HomeContent['approach'] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reveal = useReveal<HTMLDivElement>();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const steps = Array.from(list.querySelectorAll<HTMLElement>('[data-step]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const anchor = window.innerHeight * 0.55; // ligne de lecture, un peu sous le milieu
      const rect = list.getBoundingClientRect();
      const progress = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
      list.style.setProperty('--progress', progress.toFixed(4));
      steps.forEach((step) => {
        step.toggleAttribute('data-reached', step.getBoundingClientRect().top < anchor);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section className="section" aria-labelledby="approach-title">
      <div className="container grid-12">
        <div ref={reveal} data-reveal className={styles.aside}>
          <p className="eyebrow">{approach.eyebrow}</p>
          <h2 id="approach-title" className="h2 rule">
            {approach.title}
          </h2>
          <p className="lead">{approach.lead}</p>
        </div>

        <ol ref={listRef} className={styles.steps}>
          {approach.steps.map((step, index) => (
            <li key={step.title} data-step className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
