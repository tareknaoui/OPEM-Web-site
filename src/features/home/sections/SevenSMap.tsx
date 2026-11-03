import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { PauseIcon, PlayIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { DiagnosticAxis, HomeContent } from '../content';
import { LeverFrame } from './LeverFrame';
import { labelLines } from './leverLabel';
import styles from './SevenSMap.module.css';

type SevenSMapProps = {
  diagnostic: HomeContent['heroDiagnostic'];
  active: DiagnosticAxis;
  onActive: Dispatch<SetStateAction<DiagnosticAxis>>;
};

const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = 228;
const NODE = 68;
const LINE = 21;
const STEP_MS = 3200;

/** Les 6 leviers autour du cercle, en partant du haut ; les valeurs partagées au centre. */
const AROUND: DiagnosticAxis[] = [
  'strategie',
  'structure',
  'systemes',
  'competences',
  'personnel',
  'style',
];
const TOUR: DiagnosticAxis[] = [...AROUND, 'valeurs'];

const position = (index: number) => {
  const angle = ((index * 60 - 90) * Math.PI) / 180;
  return { x: CENTER + Math.cos(angle) * RADIUS, y: CENTER + Math.sin(angle) * RADIUS };
};

const POINTS = {
  ...Object.fromEntries(AROUND.map((axis, index) => [axis, position(index)])),
  valeurs: { x: CENTER, y: CENTER },
} as Record<DiagnosticAxis, { x: number; y: number }>;

/** Chaque levier relié au centre, à ses deux voisins et aux leviers à deux pas de lui. */
const LINKS = AROUND.flatMap((axis, index) => {
  const at = (offset: number) => AROUND[(index + offset) % AROUND.length]!;
  return [
    [axis, 'valeurs'],
    [axis, at(1)],
    [axis, at(2)],
  ] as [DiagnosticAxis, DiagnosticAxis][];
});

/**
 * Carte des 7 leviers de l'écran d'accueil : chaque levier s'allume à son tour avec ses liens, et
 * l'illustration de fond suit (LeverScenes). Passer sur un levier le montre et suspend la ronde.
 * Un bouton l'arrête (WCAG 2.2.2) ; elle ne démarre pas si l'utilisateur demande moins
 * d'animations.
 */
export function SevenSMap({ diagnostic, active, onActive }: SevenSMapProps) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const moving = !paused && !hovering && !reduced;
  const { welcome } = diagnostic;

  useEffect(() => {
    if (!moving) return;
    const timer = setInterval(
      () => onActive((current) => TOUR[(TOUR.indexOf(current) + 1) % TOUR.length]!),
      STEP_MS,
    );
    return () => clearInterval(timer);
  }, [moving, onActive]);

  return (
    <LeverFrame
      label={welcome.mapLabel}
      count={0}
      total={TOUR.length}
      action={
        !reduced && (
          <button
            type="button"
            className={styles.toggle}
            aria-label={paused ? welcome.play : welcome.pause}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
          </button>
        )
      }
    >
      <svg
        className={styles.graph}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={diagnostic.modelLabel}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <circle className={styles.ring} cx={CENTER} cy={CENTER} r={RADIUS} />
        {LINKS.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            className={styles.link}
            data-lit={from === active || to === active || undefined}
            x1={POINTS[from].x}
            y1={POINTS[from].y}
            x2={POINTS[to].x}
            y2={POINTS[to].y}
          />
        ))}
        {TOUR.map((axis, index) => {
          const { x, y } = POINTS[axis];
          const radius = axis === 'valeurs' ? NODE + 16 : NODE;
          const words = labelLines(diagnostic.axes[axis].label);
          return (
            <g
              key={axis}
              className={styles.node}
              style={{ '--i': index } as CSSProperties}
              data-active={axis === active || undefined}
              onMouseEnter={() => onActive(axis)}
            >
              {axis === active && (
                <circle className={styles.pulse} cx={x} cy={y} r={radius} key={axis} />
              )}
              <circle className={styles.disc} cx={x} cy={y} r={radius} />
              <text x={x} y={y - ((words.length - 1) * LINE) / 2} dominantBaseline="central">
                {words.map((word, line) => (
                  <tspan key={word} x={x} dy={line === 0 ? 0 : LINE}>
                    {word}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Nom complet du levier montré, sous la carte. */}
      <p key={active} className={styles.caption} aria-hidden="true">
        <span className={styles.captionNumber}>
          {String(TOUR.indexOf(active) + 1).padStart(2, '0')}
        </span>
        {diagnostic.axes[active].title}
      </p>
    </LeverFrame>
  );
}
