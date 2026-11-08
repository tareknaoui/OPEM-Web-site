import { useId } from 'react';
import styles from './ExpertisesPage.module.css';

/*
 * Bloc 03, « plan de tracé » : quatre voies parallèles, de même largeur, qui entrent et sortent
 * du cadre des deux côtés (les métiers ne se succèdent pas : ils avancent ensemble). Chaque voie
 * porte le nom de son métier et un filet ambre en pointillé qui avance lentement (image fixe si
 * moins d'animations est demandé). Fond : quadrillage et courbes de niveau très discrets.
 * Aucune numérotation, aucune borne, aucune flèche. Les noms restent lisibles sur téléphone
 * (19 unités ici, soit au moins 11 px à la plus petite largeur du panneau). En arabe, le nom
 * part de la droite (le texte s'écrit vers la gauche le long de la voie).
 */

const W = 600;
const H = 420;
const LANES_Y = [96, 176, 256, 336];

/** Le même tracé pour chaque voie, décalé en hauteur : des voies vraiment parallèles. */
const curve = (y: number) =>
  `M -40 ${y + 18} C 120 ${y - 26}, 250 ${y + 34}, 380 ${y + 4} S 560 ${y - 30}, ${W + 40} ${y - 8}`;

const CONTOURS = [
  'M -20 60 C 120 20, 260 110, 420 50 S 600 30, 640 70',
  'M -20 210 C 100 170, 240 250, 400 200 S 580 160, 640 220',
  'M -20 380 C 140 340, 300 420, 460 360 S 600 340, 640 390',
];

export function TraceArt({ lanes, alt, rtl }: { lanes: string[]; alt: string; rtl?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={styles.trace} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt}>
      <defs>
        <pattern id={`${id}-grid`} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" className={styles.traceGrid} />
        </pattern>
        {LANES_Y.map((y, index) => (
          <path key={y} id={`${id}-label-${index}`} d={curve(y - 7)} />
        ))}
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-grid)`} />
      {CONTOURS.map((d) => (
        <path key={d} d={d} className={styles.traceContour} />
      ))}

      {LANES_Y.map((y, index) => (
        <g key={y}>
          <path d={curve(y)} className={styles.traceRoad} />
          <path d={curve(y - 22)} className={styles.traceEdge} />
          <path d={curve(y + 22)} className={styles.traceEdge} />
          <path
            d={curve(y + 12)}
            className={styles.traceLine}
            style={{ animationDelay: `${index * -0.6}s` }}
          />
          <text className={styles.traceLabel} aria-hidden="true">
            <textPath href={`#${id}-label-${index}`} startOffset={rtl ? '91%' : '9%'}>
              {lanes[index]}
            </textPath>
          </text>
        </g>
      ))}
    </svg>
  );
}
