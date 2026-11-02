import type { ReactNode } from 'react';
import styles from './LeverFrame.module.css';

type LeverFrameProps = {
  label: string;
  /** Leviers renseignés, sur le total : « 3 / 7 ». */
  count: number;
  total: number;
  /** Sans cadre sur téléphone et tablette (place comptée pendant les questions). */
  compact?: boolean;
  action?: ReactNode;
  children: ReactNode;
};

/** Cadre commun à la carte de l'accueil et au radar des questions : titre, compteur, contenu. */
export function LeverFrame({ label, count, total, compact, action, children }: LeverFrameProps) {
  return (
    <div className={styles.frame} data-compact={compact || undefined}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count} dir="ltr">
          <span key={count} className={styles.current}>
            {count}
          </span>{' '}
          / {total}
        </span>
        {action}
      </div>
      {children}
    </div>
  );
}
