import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { cx } from '@/lib/cx';
import styles from './IssueCompass.module.css';

/** Rayon de l'orbite des six métiers, en % du cadre (le centre est à 50 %). */
const ORBIT = 37.5;
/** Rayon du disque central : les traits partent de son bord, jamais à travers le texte. */
const CORE = 22;

type Props = {
  /** Les six métiers, dans l'ordre des enjeux : titre, première prestation phare, icône. */
  items: { title: string; lead: string; Icon: PhosphorIcon | undefined }[];
  /** L'enjeu survolé (ou choisi au clavier) ; null : aucun. */
  active: number | null;
  /** Au repos, au centre : le titre du bloc des domaines (« Six métiers, une seule exigence »). */
  idle: string;
};

/**
 * Illustration du bloc 01 de « Nos expertises » : les six métiers d'OPEM en cercle autour d'un
 * centre. Au survol d'un enjeu, son métier s'allume (fond bleu, halo), un trait se dessine du
 * centre jusqu'à lui et le centre affiche son nom et sa première prestation ; les autres
 * s'estompent. Décorative : les enjeux (liens) portent l'information, d'où aria-hidden.
 */
export function IssueCompass({ items, active, idle }: Props) {
  const points = items.map((_, index) => {
    const angle = ((-90 + index * 60) * Math.PI) / 180;
    const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
    return {
      x: 50 + ORBIT * cos,
      y: 50 + ORBIT * sin,
      x0: 50 + CORE * cos,
      y0: 50 + CORE * sin,
    };
  });
  const current = active === null ? null : items[active];

  return (
    <div className={styles.stage} data-active={active ?? undefined} aria-hidden="true">
      <svg className={styles.lines} viewBox="0 0 100 100">
        <circle className={styles.ring} cx="50" cy="50" r={ORBIT} />
        <circle className={styles.ringInner} cx="50" cy="50" r={CORE} />
        {/* Un point vert fait lentement le tour de l'orbite. */}
        <g className={styles.orbiter}>
          <circle cx="50" cy={50 - ORBIT} r="0.9" />
        </g>
        {points.map((point, index) => (
          <g key={index}>
            <line className={styles.spoke} x1={point.x0} y1={point.y0} x2={point.x} y2={point.y} />
            <line
              className={cx(styles.beam, index === active && styles.beamOn)}
              x1={point.x0}
              y1={point.y0}
              x2={point.x}
              y2={point.y}
              pathLength={1}
            />
          </g>
        ))}
      </svg>

      {items.map(({ Icon }, index) => (
        <span
          key={index}
          className={cx(
            styles.node,
            index === active && styles.nodeOn,
            active !== null && index !== active && styles.nodeDim,
          )}
          style={{ insetInlineStart: `${points[index]?.x}%`, top: `${points[index]?.y}%` }}
        >
          {Icon && <Icon size={26} weight="duotone" />}
        </span>
      ))}

      <div className={styles.center}>
        {/* La clé change à chaque enjeu : le contenu se rejoue (fondu, léger glissé). */}
        <div key={active ?? 'idle'} className={styles.centerContent}>
          {current && active !== null ? (
            <>
              <span className={styles.centerNumber}>{String(active + 1).padStart(2, '0')}</span>
              <span className={styles.centerTitle}>{current.title}</span>
              <span className={styles.centerLead}>{current.lead}</span>
            </>
          ) : (
            <span className={styles.centerIdle}>{idle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
