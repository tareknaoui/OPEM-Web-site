import { useMemo } from 'react';
import { CountUp } from '@/components/ui/CountUp';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/i18n/useLanguage';
import type { HomeContent } from '../content';
import styles from './KeyFigures.module.css';
import { ProvisionalNote, SectionHeader } from './SectionHeader';

/**
 * Chiffres clés : bande pleine largeur bleu nuit, très grands chiffres qui comptent
 * de 0 à leur valeur à l'arrivée à l'écran (inspiration Wavestone).
 */
export function KeyFigures({ figures }: { figures: HomeContent['figures'] }) {
  const { lang } = useLanguage();
  const reveal = useReveal<HTMLUListElement>();

  // Une fonction de formatage stable par chiffre (« +2 000 » en français).
  const formatters = useMemo(() => {
    const numbers = new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : 'fr-FR');
    return figures.items.map(
      (item) => (value: number) => `${item.prefix ?? ''}${numbers.format(value)}`,
    );
  }, [lang, figures.items]);

  return (
    <section className={`on-dark section ${styles.band}`} aria-labelledby="figures-title">
      <div className="container">
        <SectionHeader
          id="figures-title"
          eyebrow={figures.eyebrow}
          title={figures.title}
          layout="stacked"
        />
        <ul ref={reveal} data-reveal className={styles.figures}>
          {figures.items.map((item, index) => (
            <li key={item.label} className={styles.figure}>
              <CountUp value={item.value} format={formatters[index]!} className={styles.value} />
              <span className={styles.label}>{item.label}</span>
            </li>
          ))}
        </ul>
        <ProvisionalNote show={figures.provisional}>{figures.note}</ProvisionalNote>
      </div>
    </section>
  );
}
