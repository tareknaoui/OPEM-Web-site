import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { MarkerPictogram } from '../icons';
import { HERO_POSTER_SRC, HERO_VIDEO_QUERY, HERO_VIDEO_SRC } from './heroMedia';
import styles from './HeroImmersive.module.css';

type HeroImmersiveProps = {
  hero: HomeContent['hero'];
  video: HomeContent['heroVideo'];
  immersive: HomeContent['heroImmersive'];
  markers: HomeContent['markers'];
};

/**
 * Bandeau « Immersif » : la vidéo de la ruche dans un grand cadre arrondi, détaché des
 * bords. Un voile bleu nuit uniforme couvre la vidéo pour que le texte reste lisible
 * (contraste AA). Au centre : grand titre, puis une carte « De quoi avez-vous besoin ? »
 * qui oriente vers les rubriques clés. Les 3 repères tiennent dans une pastille en bas.
 */
export function HeroImmersive({ hero, video, immersive, markers }: HeroImmersiveProps) {
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
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        <div className={styles.media} aria-hidden="true">
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
          <span className={styles.veil} />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1 id="hero-title" className={styles.headline}>
            <span className={styles.line}>
              <span>{video.headline[0]}</span>
            </span>{' '}
            <span className={cx(styles.line, styles.accent)}>
              <span>{video.headline[1]}</span>
            </span>
          </h1>
          <p className={styles.intro}>{video.intro}</p>

          <div className={styles.card}>
            <p className={styles.question} id="hero-question">
              {immersive.question}
            </p>
            <ul className={styles.choices} aria-labelledby="hero-question">
              {immersive.choices.map((choice) => (
                <li key={choice.href}>
                  <Link to={choice.href} className={styles.choice}>
                    {choice.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={hero.primary.href} className={cx('btn btn-light', styles.cta)}>
              {hero.primary.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </div>
        </div>

        <ul className={styles.markers}>
          {markers.map((marker) => (
            <li key={marker.icon} className={styles.marker}>
              <MarkerPictogram name={marker.icon} size={16} />
              {marker.label}
            </li>
          ))}
        </ul>

        {withVideo && (
          <button
            type="button"
            className={styles.pause}
            aria-label={paused ? video.play : video.pause}
            onClick={togglePlayback}
          >
            {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
          </button>
        )}
      </div>
    </section>
  );
}
