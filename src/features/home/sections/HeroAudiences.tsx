import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import { AudiencePictogram } from '../icons';
import { HeroSideVideo } from './HeroSideVideo';
import styles from './HeroAudiences.module.css';

type HeroAudiencesProps = {
  audiences: HomeContent['heroAudiences'];
  video: HomeContent['heroVideo'];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Bandeau « Public / entreprise » : sur bleu nuit, le titre puis deux grands blocs côte
 * à côte (organisme public, entreprise) : pictogramme, trois sujets en étiquettes, une
 * phrase et un lien ; tout le bloc est cliquable. Fond bleu 10 %, bordure gris clair,
 * aucun dégradé. Vidéo d'accueil sur la moitié droite.
 */
export function HeroAudiences({ audiences, video }: HeroAudiencesProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.text}>
        <p className={styles.kicker}>{audiences.kicker}</p>
        <h1 id="hero-title" className={styles.headline}>
          {audiences.headline[0]} <span className={styles.accent}>{audiences.headline[1]}</span>
        </h1>
        <p className={styles.intro}>{audiences.intro}</p>

        <ul className={styles.blocks}>
          {audiences.blocks.map((block, index) => (
            <li key={block.id} className={styles.block}>
              <div className={styles.blockTop} aria-hidden="true">
                <span className={styles.blockIcon}>
                  <AudiencePictogram name={block.icon} size={26} />
                </span>
                <span className={styles.blockNumber}>{pad(index + 1)}</span>
              </div>

              <h2 className={styles.blockTitle}>{block.title}</h2>
              <ul className={styles.tags}>
                {block.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              <p className={styles.blockText}>{block.text}</p>

              <Link to={block.link.href} className={styles.blockLink}>
                {block.link.label}
                <span className={styles.blockArrow} aria-hidden="true">
                  <ArrowRightIcon size={16} className="arrow" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <HeroSideVideo video={video} className={styles.media} />
    </section>
  );
}
