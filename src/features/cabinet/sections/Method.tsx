import { useRef, type CSSProperties } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import type { CabinetContent } from '../content';
import styles from './Method.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Démarche en 3 niveaux, sur bleu très clair. Ordinateur : le titre et un grand compteur
 * restent fixes à gauche pendant que les étapes défilent à droite ; le compteur roule
 * (01 → 02 → 03) et un filet bleu OPEM se remplit le long des étapes. Mobile : la même
 * liste, filet compris, sans partie fixe. Écrit directement en CSS (--progress, --step,
 * data-reached) : aucun re-rendu au défilement.
 */
export function Method({ method }: { method: CabinetContent['method'] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useScrollProgress(
    listRef,
    (progress, list) => {
      const section = sectionRef.current;
      if (!section) return;
      list.style.setProperty('--progress', progress.toFixed(4));
      // Étape « atteinte » quand son haut passe la ligne de lecture (milieu de l'écran).
      const steps = list.querySelectorAll<HTMLElement>('[data-step]');
      let current = 0;
      steps.forEach((step, index) => {
        const reached = step.getBoundingClientRect().top < window.innerHeight * 0.55;
        step.toggleAttribute('data-reached', reached);
        if (reached) current = index;
      });
      section.style.setProperty('--step', String(current));
    },
    { start: 0.55, end: 0.55 },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="method-title"
      style={{ '--count': method.steps.length } as CSSProperties}
    >
      <div className="container grid-12">
        <div className={styles.aside}>
          <div className={styles.sticky} data-reveal>
            <p className="eyebrow">{method.eyebrow}</p>
            <h2 id="method-title" className="h2">
              {method.title}
            </h2>
            {/* Compteur qui roule d'une étape à l'autre (décoratif). */}
            <div className={styles.counter} aria-hidden="true">
              <span className={styles.reel}>
                {method.steps.map((step, index) => (
                  <span key={step.title}>{pad(index + 1)}</span>
                ))}
              </span>
              <span className={styles.total}>/{pad(method.steps.length)}</span>
            </div>
          </div>
        </div>

        <ol ref={listRef} className={styles.steps}>
          {method.steps.map((step, index) => (
            <li key={step.title} data-step className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className={styles.note} data-reveal>
          {method.note}
        </p>
      </div>
    </section>
  );
}
