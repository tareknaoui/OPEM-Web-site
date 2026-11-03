import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import { useTweened } from '@/hooks/useTweened';
import { cx } from '@/lib/cx';
import type { DiagnosticAxis, HomeContent } from '../content';
import type { AxisScores } from './diagnosticScore';
import { labelLines } from './leverLabel';
import styles from './SevenSRadar.module.css';

/** Rayon du niveau 3 (plein), en unités du dessin. */
const R = 88;

/** Formes d'exemple que prend le radar d'invitation, tour à tour (niveaux 0 à 3). */
const IDLE = [
  [2.4, 1.6, 2.8, 1.2, 2.2, 1.4, 2.6],
  [1.4, 2.6, 1.8, 2.8, 1.6, 2.4, 1.9],
  [2.8, 2.1, 1.3, 2.2, 2.9, 1.8, 1.5],
];

export type RadarMode = 'idle' | 'result';

type SevenSRadarProps = {
  diagnostic: HomeContent['heroDiagnostic'];
  /**
   * idle : invitation, la forme respire d'un exemple à l'autre ;
   * result : la forme pousse depuis le centre, l'organisation alignée en pointillés.
   */
  mode: RadarMode;
  scores?: AxisScores;
  /** Leviers à renforcer, signalés de la même façon sur le résultat. */
  weak?: DiagnosticAxis[];
  /** light : sur blanc (bleu OPEM) ; dark : sur bleu nuit (blanc). */
  tone?: 'light' | 'dark';
  /** false : petit radar sans noms, cadré au plus près, traits plus épais (signature). */
  labels?: boolean;
  className?: string;
};

function vertex(index: number, count: number, level: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  const radius = (R * level) / 3;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: radius * cos, y: radius * sin, cos, sin };
}

/** Hauteur d'une ligne de nom, en unités du dessin. */
const LABEL_LINE = 15;

const points = (levels: readonly number[]) =>
  levels
    .map((level, index) => {
      const { x, y } = vertex(index, levels.length, level);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

/**
 * Radar des 7S : une branche par levier, trois anneaux (niveaux 1 à 3), la forme de
 * l'organisation par-dessus. Elle se déforme en douceur (useTweened) ; en mouvement réduit,
 * elle prend directement sa forme finale.
 */
export function SevenSRadar({
  diagnostic,
  mode,
  scores = {},
  weak = [],
  tone = 'light',
  labels = true,
  className,
}: SevenSRadarProps) {
  const axes = diagnostic.questions.map((question) => question.id);
  const count = axes.length;
  const [preset, setPreset] = useState(0);

  useEffect(() => {
    if (mode !== 'idle' || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setPreset((index) => (index + 1) % IDLE.length), 2800);
    return () => window.clearInterval(timer);
  }, [mode]);

  const target = mode === 'idle' ? (IDLE[preset] ?? []) : axes.map((axis) => scores[axis] ?? 0);
  const zeros = axes.map(() => 0);
  const values = useTweened(target, mode === 'idle' ? 1600 : 1400, zeros);

  // Ondes : les leviers à renforcer, sur le résultat.
  const beacons = mode === 'result' ? weak : [];

  return (
    <figure
      className={cx(styles.radar, className)}
      data-tone={tone}
      data-mode={mode}
      data-compact={!labels || undefined}
      aria-label={diagnostic.modelLabel}
    >
      <svg
        className={styles.svg}
        viewBox={labels ? '-210 -140 420 272' : '-94 -94 188 188'}
        aria-hidden="true"
        focusable="false"
      >
        {[1, 2, 3].map((level) => (
          <polygon
            key={level}
            className={cx(styles.ring, mode === 'result' && level === 3 && styles.ideal)}
            points={points(zeros.map(() => level))}
          />
        ))}
        {axes.map((axis, index) => {
          const end = vertex(index, count, 3);
          return <line key={axis} className={styles.spoke} x1={0} y1={0} x2={end.x} y2={end.y} />;
        })}

        <polygon className={styles.shape} points={points(values)} />
        {axes.map((axis, index) => {
          const { x, y } = vertex(index, count, values[index] ?? 0);
          return (
            <circle
              key={axis}
              className={styles.dot}
              cx={x}
              cy={y}
              r={3.5}
              data-weak={(mode === 'result' && weak.includes(axis)) || undefined}
            />
          );
        })}

        {beacons.map((axis) => {
          const { x, y } = vertex(axes.indexOf(axis), count, 3);
          return <circle key={axis} className={styles.beacon} cx={x} cy={y} r={7} />;
        })}

        {labels &&
          axes.map((axis, index) => {
            const { x, y, cos, sin } = vertex(index, count, 3);
            const lines = labelLines(diagnostic.axes[axis].label);
            // Nom au-dessus du radar : les lignes montent ; sur les côtés, elles sont centrées.
            const shift = sin < -0.5 ? lines.length - 1 : sin > 0.5 ? 0 : (lines.length - 1) / 2;
            return (
              <text
                key={axis}
                className={styles.label}
                x={x + cos * 14}
                y={y + sin * 14}
                textAnchor={Math.abs(cos) < 0.25 ? 'middle' : cos > 0 ? 'start' : 'end'}
                dominantBaseline={sin < -0.5 ? 'auto' : sin > 0.5 ? 'hanging' : 'central'}
              >
                {lines.map((line, row) => (
                  <tspan
                    key={line}
                    x={x + cos * 14}
                    dy={row === 0 ? -shift * LABEL_LINE : LABEL_LINE}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
      </svg>

      {mode === 'result' && (
        <ul className="sr-only">
          {axes.map((axis) => (
            <li key={axis}>
              {diagnostic.axes[axis].label}
              {' – '}
              {diagnostic.result.axisScore.replace('{score}', String(scores[axis] ?? 0))}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
