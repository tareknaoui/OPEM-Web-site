import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { HeroSideVideo } from './HeroSideVideo';
import { ProvisionalNote } from './SectionHeader';
import styles from './HeroFacts.module.css';

type HeroFactsProps = {
  hero: HomeContent['hero'];
  video: HomeContent['heroVideo'];
  facts: HomeContent['heroFacts'];
};

/**
 * Bandeau « Repères » : sur bleu nuit, titre, texte, bouton devis et deux liens (expertises,
 * formations), puis une ligne de trois
 * faits courts séparés par un trait gris clair, avec la mention « à confirmer » tant que
 * les chiffres sont provisoires. Vidéo d'accueil sur la moitié droite.
 */
export function HeroFacts({ hero, video, facts }: HeroFactsProps) {
  return (
    <section className={cx(styles.hero, 'on-dark')} aria-labelledby="hero-title">
      <div className={styles.text}>
        <p className={styles.kicker}>{hero.eyebrow}</p>
        <h1 id="hero-title" className={styles.headline}>
          {video.headline[0]} <span className={styles.accent}>{video.headline[1]}</span>
        </h1>
        <p className={styles.intro}>{video.intro}</p>

        <div className={styles.actions}>
          <Link to={hero.primary.href} className="btn btn-light">
            {hero.primary.label}
            <ArrowRightIcon size={18} className="arrow" />
          </Link>
          {/* Les deux liens restent ensemble : ils passent sous le bouton d'un seul bloc. */}
          <span className={styles.links}>
            {facts.links.map((link) => (
              <Link key={link.href} to={link.href} className={styles.textLink}>
                {link.label}
                <ArrowRightIcon size={16} className="arrow" />
              </Link>
            ))}
          </span>
        </div>

        <ul className={styles.facts} aria-label={facts.label}>
          {facts.items.map((fact) => (
            <li key={fact.label} className={styles.fact}>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </li>
          ))}
        </ul>
        <ProvisionalNote show={facts.provisional}>{facts.note}</ProvisionalNote>
      </div>

      <HeroSideVideo video={video} className={styles.media} />
    </section>
  );
}
