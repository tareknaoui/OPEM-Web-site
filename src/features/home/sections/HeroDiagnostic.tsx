import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { CountUp } from '@/components/ui/CountUp';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { DiagnosticCard } from './DiagnosticCard';
import {
  HERO_POSTER_SRC,
  HERO_VIDEO_MOBILE_QUERY,
  HERO_VIDEO_MOBILE_SRC,
  HERO_VIDEO_QUERY,
  HERO_VIDEO_SRC,
} from './heroMedia';
import styles from './HeroDiagnostic.module.css';

/** « +1 500 » dans les deux langues (en arabe, ar-DZ écrirait « 1.500 », lu comme 1,5). */
const NUMBERS = new Intl.NumberFormat('fr-FR');

/**
 * Les lignes du texte d'accueil. Un « \n » dans le texte (content.ts) va à la ligne à cet
 * endroit précis ; sans « \n », toutes les phrases sauf la dernière, puis la dernière seule.
 */
function introLines(text: string) {
  if (text.includes('\n')) return text.split('\n').map((line) => line.trim());
  const sentences = text.match(/[^.]+\./g)?.map((sentence) => sentence.trim()) ?? [];
  if (sentences.length < 2) return [text];
  return [sentences.slice(0, -1).join(' '), sentences[sentences.length - 1]!];
}

type HeroDiagnosticProps = {
  hero: HomeContent['hero'];
  video: HomeContent['heroVideo'];
  diagnostic: HomeContent['heroDiagnostic'];
  figures: HomeContent['figures'];
};

/**
 * Bandeau d'accueil retenu, éditorial comme ceux des grands cabinets :
 * - à gauche sur bleu nuit, le métier d'abord : titre, texte, puis les chiffres clés qui
 *   comptent l'un après l'autre (repères ambre : la touche d'ambre de la charte, sur fond foncé) ;
 * - à droite, la vidéo de l'équipe jusqu'au bord de l'écran (charte : aucun texte dessus),
 *   muette, en boucle, avec un bouton pause (WCAG 2.2.2) ; image fixe en mouvement réduit ;
 * - en bas, sur toute la largeur, le bandeau blanc « Par où commencer ? » de l'autodiagnostic
 *   7S, présenté comme une aide pour s'orienter.
 * Sur mobile : texte, vidéo, puis le bandeau.
 */
export function HeroDiagnostic({ hero, video, diagnostic, figures }: HeroDiagnosticProps) {
  const withVideo = useMediaQuery(HERO_VIDEO_QUERY);
  const smallScreen = useMediaQuery(HERO_VIDEO_MOBILE_QUERY);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  // Une fonction de formatage stable par chiffre, pour CountUp.
  const formatters = useMemo(
    () =>
      figures.items.map(
        (item) => (value: number) => `${item.prefix ?? ''}${NUMBERS.format(value)}`,
      ),
    [figures.items],
  );

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
    <section className={cx(styles.hero, 'on-dark')} aria-labelledby="hero-title">
      <div className={styles.text}>
        <p className={styles.kicker}>{hero.eyebrow}</p>
        <h1 id="hero-title" className={styles.headline}>
          <span className={styles.headlineLine}>{video.headline[0]}</span>{' '}
          <span className={cx(styles.headlineLine, styles.accent)}>{video.headline[1]}</span>
        </h1>
        {/* Phrases courtes réparties sur deux lignes (la moitié chacune). */}
        <p className={styles.intro}>
          {introLines(video.intro).map((line) => (
            <span key={line} className={styles.introLine}>
              {line}
            </span>
          ))}
        </p>
        <Link to={video.cta.href} className={`btn ${styles.cta}`}>
          {video.cta.label}
          <ArrowRightIcon size={18} className="arrow" />
        </Link>

        <ul className={styles.figures} aria-label={figures.title}>
          {figures.items.map((item, index) => (
            <li
              key={item.label}
              className={styles.figure}
              style={{ '--i': index } as CSSProperties}
            >
              <CountUp
                value={item.value}
                format={formatters[index]!}
                durationMs={1400}
                delayMs={500 + index * 180}
                className={styles.value}
              />
              <span className={styles.figureLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.media}>
        {withVideo ? (
          <>
            <video
              ref={videoRef}
              className={styles.video}
              src={smallScreen ? HERO_VIDEO_MOBILE_SRC : HERO_VIDEO_SRC}
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

      <DiagnosticCard diagnostic={diagnostic} className={styles.band} />
    </section>
  );
}
