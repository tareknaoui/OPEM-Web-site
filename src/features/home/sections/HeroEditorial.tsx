import { useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, ArrowUpIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { HERO_POSTER_SRC, HERO_VIDEO_QUERY, HERO_VIDEO_SRC } from './heroMedia';
import styles from './HeroEditorial.module.css';

type HeroEditorialProps = {
  hero: HomeContent['hero'];
  video: HomeContent['heroVideo'];
  editorial: HomeContent['heroEditorial'];
  /** `dark` : couleurs inversées (fond bleu nuit, légende sur bandeau blanc). */
  tone?: 'light' | 'dark';
};

const pad = (n: number) => String(n).padStart(2, '0');
const ARABIC = /[؀-ۿ]/;

/**
 * Bandeau « Éditorial » : mise en page de cabinet (beaucoup d'air, très grand titre,
 * filets fins). La vidéo de la ruche est présentée comme une photo de magazine : une
 * fenêtre qui se dévoile, et sa légende sur un bandeau bleu nuit (jamais sur l'image).
 * En bas, les trois métiers en liens.
 */
export function HeroEditorial({ hero, video, editorial, tone = 'light' }: HeroEditorialProps) {
  const withVideo = useMediaQuery(HERO_VIDEO_QUERY);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const badgePathId = useId();

  const togglePlayback = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      void element.play();
      setPaused(false);
    } else {
      element.pause();
      setPaused(true);
    }
  };

  return (
    <section
      className={cx(styles.hero, tone === 'dark' && styles.dark)}
      aria-labelledby="hero-title"
    >
      <div className={cx('container', styles.grid)}>
        <div className={styles.text}>
          <p className={styles.kicker}>{editorial.kicker}</p>
          <h1 id="hero-title" className={styles.headline}>
            <span className={styles.line}>
              <span>{editorial.headline[0]}</span>
            </span>{' '}
            <span className={cx(styles.line, styles.accent)}>
              <span>{editorial.headline[1]}</span>
            </span>
          </h1>
          <p className={styles.intro}>{editorial.intro}</p>
          <div className={styles.actions}>
            {/* Sur bleu nuit, bouton blanc : le bleu OPEM ne touche jamais le bleu nuit. */}
            <Link
              to={hero.primary.href}
              className={cx('btn', tone === 'dark' ? 'btn-light' : 'btn-primary')}
            >
              {hero.primary.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
            <Link to={hero.secondary.href} className={styles.textLink}>
              {hero.secondary.label}
              <ArrowRightIcon size={16} className="arrow" />
            </Link>
          </div>
        </div>

        <figure className={styles.window}>
          <div className={styles.media}>
            {withVideo ? (
              <video
                ref={videoRef}
                className={styles.video}
                src={HERO_VIDEO_SRC}
                poster={HERO_POSTER_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
              />
            ) : (
              <img
                className={styles.video}
                src={HERO_POSTER_SRC}
                alt=""
                width={1280}
                height={720}
                fetchPriority="high"
              />
            )}
          </div>

          <figcaption className={styles.caption}>
            <span>{editorial.caption}</span>
            {withVideo && (
              <button
                type="button"
                className={styles.pause}
                aria-label={paused ? video.play : video.pause}
                onClick={togglePlayback}
              >
                {paused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
              </button>
            )}
          </figcaption>

          {/* Badge circulaire au texte tournant (décoratif : son texte est déjà dans la page). */}
          <span className={styles.badge} aria-hidden="true">
            <svg viewBox="0 0 120 120" className={styles.badgeText}>
              <path
                id={badgePathId}
                d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"
                fill="none"
              />
              <text>
                {/* textLength répartit le texte sur tout le cercle ; pas en arabe, où
                    l'espacement forcé casserait les liaisons entre les lettres. */}
                <textPath
                  href={`#${badgePathId}`}
                  textLength={ARABIC.test(editorial.badge) ? undefined : 276}
                >
                  {editorial.badge}
                </textPath>
              </text>
            </svg>
            <span className={styles.badgeCore}>
              <ArrowUpIcon size={18} className={styles.badgeArrow} />
            </span>
          </span>
        </figure>
      </div>

      <nav aria-label={editorial.pillarsLabel} className={cx('container', styles.pillarsWrap)}>
        <ol className={styles.pillars}>
          {editorial.pillars.map((pillar, index) => (
            <li key={pillar.href}>
              <Link to={pillar.href} className={styles.pillar}>
                <span className={styles.pillarNumber}>{pad(index + 1)}</span>
                <span className={styles.pillarTitle}>
                  {pillar.title}
                  <ArrowRightIcon size={18} className={cx('arrow', styles.pillarArrow)} />
                </span>
                <span className={styles.pillarText}>{pillar.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
