import { useState } from 'react';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { DiagnosticExperience } from './DiagnosticExperience';
import { SevenSRadar } from './SevenSRadar';
import styles from './DiagnosticCard.module.css';

type DiagnosticCardProps = {
  diagnostic: HomeContent['heroDiagnostic'];
  className?: string;
};

/**
 * Bandeau blanc « Par où commencer ? » en bas de l'accroche : l'autodiagnostic 7S présenté
 * sobrement, comme une aide pour s'orienter. Un petit radar des 7 leviers qui respire en
 * signature, une phrase, un bouton qui ouvre le diagnostic en plein écran
 * (DiagnosticExperience) ; en le fermant, le focus revient au bouton.
 */
export function DiagnosticCard({ diagnostic, className }: DiagnosticCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cx(styles.band, className)}>
      <div className={cx('container', styles.inner)}>
        <SevenSRadar diagnostic={diagnostic} mode="idle" labels={false} className={styles.mark} />
        <div>
          <p className={styles.label}>{diagnostic.label}</p>
          <div className={styles.line}>
            <h2 className={styles.title}>{diagnostic.intro.title}</h2>
            <p className={styles.text}>{diagnostic.intro.text}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <p className={styles.duration}>{diagnostic.duration}</p>
          <button
            type="button"
            className="btn btn-primary"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            {diagnostic.intro.start}
            <ArrowRightIcon size={18} className="arrow" />
          </button>
        </div>
      </div>

      <DiagnosticExperience diagnostic={diagnostic} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
