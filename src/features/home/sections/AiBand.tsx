import { Link } from 'react-router';
import { ArrowRightIcon, Icon } from '@/components/icons';
import type { HomeContent } from '../content';
import styles from './AiBand.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Bandeau « Intelligence artificielle appliquée », juste sous les domaines, dans le même bleu
 * nuit, séparé d'eux par un filet. À gauche l'étiquette (étoile qui scintille), le grand titre,
 * le texte et le bouton ; à droite l'illustration de la porte, qui se fond dans le fond (même
 * bleu, bords estompés) ; dessous, les trois temps dans un cadre à filets, parcourus l'un après
 * l'autre par un filet lumineux. Animations coupées en mouvement réduit.
 */
export function AiBand({ ai }: { ai: HomeContent['ai'] }) {
  return (
    <section className={styles.section} aria-labelledby="ai-title">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.intro}>
            <p className={styles.eyebrow} data-reveal>
              <Icon size={18} className={styles.spark}>
                <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />
              </Icon>
              {ai.eyebrow}
            </p>
            <h2 id="ai-title" className={styles.title} data-reveal="title">
              {ai.title}
            </h2>
            <p className={styles.text} data-reveal>
              {ai.text}
            </p>
            <Link to={ai.cta.href} className={`btn ${styles.cta}`} data-reveal>
              {ai.cta.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </div>

          <div className={styles.visual}>
            <img
              className={styles.image}
              src={ai.illustration}
              srcSet={`${ai.illustration.replace(/\.webp$/, '-700.webp')} 700w, ${ai.illustration} 1200w`}
              sizes="(min-width: 64em) 45vw, 100vw"
              alt=""
              width={1200}
              height={1042}
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
