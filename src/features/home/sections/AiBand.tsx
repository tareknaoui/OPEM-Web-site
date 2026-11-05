import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import type { HomeContent } from '../content';
import styles from './AiBand.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/** Entoure la première occurrence de `word` dans `text` d'un <strong> (texte inchangé sinon). */
function Highlight({ text, word, className }: { text: string; word: string; className?: string }) {
  const at = word ? text.indexOf(word) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <strong className={className}>{word}</strong>
      {text.slice(at + word.length)}
    </>
  );
}

/**
 * Bandeau « Intelligence artificielle appliquée », juste sous les domaines, dans le même bleu
 * nuit, séparé d'eux par un filet. À gauche l'étiquette, le grand titre (« IA » en ambre, écho
 * du nœud ambre de l'illustration), le texte (« intelligence artificielle » en blanc) et le bouton blanc « Passer la porte », vers la page IA appliquée ; à droite
 * l'illustration de la porte, qui se fond dans le fond (même bleu, bords estompés) et « s'ouvre »
 * au défilement : la lumière et les réseaux sortent de la porte ; dessous, les
 * trois temps dans un cadre à filets, parcourus l'un après l'autre par un filet lumineux.
 * Animations coupées en mouvement réduit.
 */
export function AiBand({ ai }: { ai: HomeContent['ai'] }) {
  // La porte « s'ouvre » au défilement : de la porte seule à toute l'image (variable --open,
  // de 0 à 1, écrite sans re-rendu). Mouvement réduit : l'image entière d'emblée.
  const visualRef = useRef<HTMLDivElement>(null);
  useScrollProgress(
    visualRef,
    (progress, element) => {
      element.style.setProperty('--open', prefersReducedMotion() ? '1' : progress.toFixed(3));
    },
    { start: 0.95, end: 0.55 },
  );

  return (
    <section className={styles.section} aria-labelledby="ai-title">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.intro}>
            <p className={styles.eyebrow} data-reveal>
              {ai.eyebrow}
            </p>
            <h2 id="ai-title" className={styles.title} data-reveal="title">
              <Highlight
                text={ai.title}
                word={ai.highlight.title}
                className={styles.titleHighlight}
              />
            </h2>
            <p className={styles.text} data-reveal>
              <Highlight text={ai.text} word={ai.highlight.text} className={styles.textHighlight} />
            </p>
            <Link
              to={ai.cta.href}
              className={`btn ${styles.cta}`}
              aria-label={ai.cta.ariaLabel}
              data-reveal
            >
              {ai.cta.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </div>

          <div ref={visualRef} className={styles.visual}>
            <img
              className={styles.image}
              src={ai.illustration}
              srcSet={`${ai.illustration.replace(/\.webp$/, '-700.webp')} 700w, ${ai.illustration} 1024w`}
              sizes="(min-width: 64em) 45vw, 100vw"
              alt=""
              width={1024}
              height={572}
              loading="lazy"
              decoding="async"
            />
          </div>

          <ol className={styles.steps} aria-label={ai.stepsLabel} data-reveal-stagger>
            {ai.steps.map((step, index) => (
              <li key={step.label} className={styles.step}>
                <span className={styles.number} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <span className={styles.label}>{step.label}</span>
                <span className={styles.stepText}>{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
