import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import styles from './SectionHeader.module.css';

type SectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  /** « split » : titre à gauche (7 col.), texte ou action à droite (5 col.). */
  layout?: 'split' | 'stacked';
  aside?: ReactNode;
};

/** En-tête de section : étiquette, très grand titre, peu de texte. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  layout = 'split',
  aside,
}: SectionHeaderProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div ref={reveal} data-reveal className={cx('grid-12', styles.header, styles[layout])}>
      <div className={styles.titles}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="h2">
          {title}
        </h2>
      </div>
      {(lead || aside) && (
        <div className={styles.aside}>
          {lead && <p className={cx('lead', styles.lead)}>{lead}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}

/** Mention discrète pour un contenu non encore validé par OPEM. */
export function ProvisionalNote({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return <p className={styles.provisional}>{children}</p>;
}
