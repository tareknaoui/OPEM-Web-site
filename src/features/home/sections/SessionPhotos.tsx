import { useEffect, useState } from 'react';
import { PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { HomeContent } from '../content';
import styles from './UpcomingSessions.module.css';

const DELAY_MS = 3500;

type SessionPhotosProps = {
  photos: HomeContent['trainings']['photos'];
  controls: HomeContent['trainings']['photoControls'];
};

/**
 * Photos de sessions dans la dernière case de l'agenda. Plusieurs photos : elles se succèdent en
 * fondu toutes les 3,5 secondes, avec un bouton pause (WCAG 2.2.2) et une pastille par photo ;
 * le défilement s'arrête au survol et au focus, et ne démarre pas en mouvement réduit.
 */
export function SessionPhotos({ photos, controls }: SessionPhotosProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const many = photos.length > 1;
  const playing = many && !paused && !held && !reducedMotion;

  // Un compte à rebours par photo : choisir une photo le relance depuis le début.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex((index + 1) % photos.length), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, photos.length]);

  return (
    <div
      className={styles.slides}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {photos.map((photo, i) => (
        <img
          key={photo.src}
          className={styles.slide}
          data-active={i === index || undefined}
          aria-hidden={i === index ? undefined : true}
          src={photo.src}
          srcSet={`${photo.src.replace(/\.webp$/, '-700.webp')} 700w, ${photo.src} 1200w`}
          sizes="(min-width: 64em) 30vw, (min-width: 48em) 50vw, 82vw"
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      ))}
      {many && (
        <div className={styles.slideControls}>
          {!reducedMotion && (
            <button
              type="button"
              className={styles.slidePause}
              aria-label={paused ? controls.play : controls.pause}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
            </button>
          )}
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className={styles.dot}
              aria-label={controls.show
                .replace('{n}', String(i + 1))
                .replace('{total}', String(photos.length))}
              aria-current={i === index || undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
