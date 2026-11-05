import type { HomeContent } from '../content';
import styles from './QuoteOfMonth.module.css';
import { QuoteIllustration } from './QuoteIllustration';

/**
 * « La citation du mois » : une courte bande bleu très clair entre les domaines et le bandeau IA
 * (tous deux bleu nuit), qui marque une pause. À gauche, l'étiquette, la citation sur un grand
 * guillemet vert en filigrane, l'auteur et l'ouvrage, puis le commentaire d'OPEM dans une carte
 * blanche à filet vert ; à droite, le rocher contourné (animé au défilement). Mobile :
 * l'illustration au-dessus.
 * Texte remplacé chaque mois depuis WordPress (useQuoteOfMonth).
 */
export function QuoteOfMonth({ quote }: { quote: HomeContent['quoteOfMonth'] }) {
  return (
    <section className={styles.section} aria-labelledby="quote-of-month-title">
      <div className="container">
        <div className={styles.layout}>
          <QuoteIllustration />
          <div className={styles.text} data-reveal>
            <p id="quote-of-month-title" className={styles.label}>
              {quote.eyebrow}
            </p>
            <figure className={styles.figure}>
              <span className={styles.mark} aria-hidden="true">
                “
              </span>
              <blockquote className={styles.quote}>
                <p>{quote.quote}</p>
              </blockquote>
              <figcaption className={styles.signature}>
                <span className={styles.author}>{quote.author}</span>
                {quote.source && <cite className={styles.source}>{quote.source}</cite>}
              </figcaption>
            </figure>
            {quote.comment && (
              <div className={styles.comment}>
                <p className={styles.commentLabel}>{quote.commentLabel}</p>
                <p className={styles.commentText}>{quote.comment}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
