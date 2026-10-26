import { useRef, useState } from 'react';
import { PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { HERO_POSTER_SRC, HERO_VIDEO_QUERY, HERO_VIDEO_SRC } from './heroMedia';
import styles from './HeroSideVideo.module.css';

type HeroSideVideoProps = {
  video: HomeContent['heroVideo'];
  /** Placement dans la grille du bandeau (moitié droite, jusqu'au bord de l'écran). */
  className?: string;
  /** Texte alternatif de l'image fixe (vide si décorative). */
  alt?: string;
};

/**
 * Vidéo d'accueil à côté du texte (jamais de texte dessus), muette, en boucle, avec un
 * bouton pause (WCAG 2.2.2). Sur mobile ou en mouvement réduit : image fixe seulement.
 * Partagée par les bandeaux « Autodiagnostic », « Trois questions » et « Public / entreprise ».
 */
export function HeroSideVideo({ video, className, alt = '' }: HeroSideVideoProps) {
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
    <div className={cx(styles.media, className)}>
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
            data-scroll-zoom
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
          alt={alt}
          width={1280}
          height={720}
          fetchPriority="high"
          data-scroll-zoom
        />
      )}
    </div>
  );
}
