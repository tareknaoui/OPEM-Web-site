import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { HeroMarkers } from './Hero';
import { HERO_POSTER_SRC, HERO_VIDEO_QUERY, HERO_VIDEO_SRC } from './heroMedia';
import styles from './HeroVideo.module.css';

type HeroVideoProps = {
  hero: HomeContent['hero'];
  video: HomeContent['heroVideo'];
  markers: HomeContent['markers'];
};

/**
 * Bandeau d'accueil « Vidéo » : texte sur un panneau bleu nuit, vidéo de la ruche à côté
 * (charte : jamais de texte sur une image). La vidéo est décorative, muette, en boucle,
 * avec un bouton pause (WCAG 2.2.2).
 */
export function HeroVideo({ hero, video, markers }: HeroVideoProps) {
  const withVideo = useMediaQuery(HERO_VIDEO_QUERY);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

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
    <>
      <section className={cx(styles.hero, 'on-dark')} aria-labelledby="hero-title">
        <div className={styles.text}>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className={styles.headline}>
            <span className={styles.line}>
              <span>{video.headline[0]}</span>
            </span>{' '}
            <span className={cx(styles.line, styles.accent)}>
              <span>{video.headline[1]}</span>
            </span>
          </h1>
          <p className={styles.intro}>{video.intro}</p>
          <div className={styles.actions}>
            <Link to={hero.primary.href} className="btn btn-light">
              {hero.primary.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
            <Link to={hero.secondary.href} className={cx('btn', styles.ghost)}>
              {hero.secondary.label}
            </Link>
          </div>
        </div>

        <div className={styles.media}>
          {withVideo ? (
            <>
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
              <button
                type="button"
                className={styles.pause}
                aria-label={paused ? video.play : video.pause}
                onClick={togglePlayback}
              >
                {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
              </button>
            </>
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
      </section>

      <HeroMarkers markers={markers} />
    </>
  );
}
