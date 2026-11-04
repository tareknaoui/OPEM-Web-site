import { useRef } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import type { CabinetContent } from '../content';
import styles from './Manifesto.module.css';

/**
 * « Qui nous sommes » : un manifeste en très grand, dont les mots passent du gris au bleu OPEM
 * à mesure qu'on fait défiler la page (lecture guidée, sans re-rendu : data-lit posé
 * directement). Mouvement réduit : tout est allumé d'emblée. Puis la vision du cabinet et la
 * citation sur l'excellence.
 */
export function Manifesto({ about }: { about: CabinetContent['about'] }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const words = about.statement.split(' ');

  useScrollProgress(
    textRef,
    (progress, element) => {
      const spans = element.children;
      const lit = prefersReducedMotion() ? spans.length : Math.round(progress * spans.length);
      for (let index = 0; index < spans.length; index += 1) {
        spans[index]!.toggleAttribute('data-lit', index < lit);
      }
    },
    { start: 0.8, end: 0.55 },
  );

  return (
    <section className={styles.section} aria-labelledby="about-title">
      <div className="container">
        <h2 id="about-title" className={styles.title} data-reveal>
          {about.title}
        </h2>
        <p ref={textRef} className={styles.statement}>
          {words.map((word, index) => (
            // Un mot par élément ; l'espace reste dans le texte (copier-coller, lecteurs d'écran).
            <span key={index} className={styles.word}>
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        <div className={styles.vision} data-reveal>
          <h3 className={styles.visionTitle}>{about.vision.title}</h3>
          <p className={styles.visionText}>{about.vision.text}</p>
        </div>

        <blockquote className={styles.quote} data-reveal="title">
          <p>{about.quote}</p>
        </blockquote>
      </div>
    </section>
  );
}
