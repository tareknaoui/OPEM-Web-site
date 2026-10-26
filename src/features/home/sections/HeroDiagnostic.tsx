import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { NeedPictogram } from '../icons';
import { HeroSideVideo } from './HeroSideVideo';
import styles from './HeroDiagnostic.module.css';

type HeroDiagnosticProps = {
  diagnostic: HomeContent['heroDiagnostic'];
  video: HomeContent['heroVideo'];
};

/**
 * Bandeau « Autodiagnostic » : sur bleu nuit, le titre puis une question et de grandes
 * réponses (suite du diagnostic, ou catalogue des formations pour la dernière).
 * La vidéo d'accueil occupe la moitié droite jusqu'au bord de l'écran. Aucune autre animation.
 */
export function HeroDiagnostic({ diagnostic, video }: HeroDiagnosticProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.text}>
        <p className={styles.kicker}>{diagnostic.kicker}</p>
        <h1 id="hero-title" className={styles.headline}>
          {diagnostic.headline}
        </h1>

        <div className={styles.diagnostic}>
          <h2 id="hero-question" className={styles.question}>
            {diagnostic.question}
          </h2>
          <ul className={styles.choices} aria-labelledby="hero-question">
            {diagnostic.choices.map((choice) => (
              <li key={choice.id}>
                <Link to={choice.href} className={styles.choice}>
                  <span className={styles.choiceIcon} aria-hidden="true">
                    <NeedPictogram name={choice.icon} size={22} />
                  </span>
                  <span className={styles.choiceLabel}>{choice.label}</span>
                  <ArrowRightIcon size={18} className={cx('arrow', styles.choiceArrow)} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HeroSideVideo video={video} className={styles.media} alt={diagnostic.imageAlt} />
    </section>
  );
}
