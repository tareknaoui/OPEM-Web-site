import { useId, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import { ProvisionalNote } from './SectionHeader';
import styles from './Faq.module.css';

type FaqProps = {
  faq: HomeContent['faq'];
};

/**
 * Questions fréquentes, dernière section de l'accueil : à gauche le titre et un encadré
 * « Vous ne trouvez pas votre réponse ? » (reste visible au défilement), à droite les
 * questions en accordéon (titre h3 contenant un bouton, motif WAI-ARIA). Plusieurs
 * réponses peuvent être ouvertes ; la première l'est au départ. Une réponse fermée est
 * inerte (ni lue, ni atteinte au clavier) ; elle s'ouvre en douceur.
 */
export function Faq({ faq }: FaqProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(
    () => new Set(faq.items.slice(0, 1).map((item) => item.id)),
  );
  const baseId = useId();

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <p className="eyebrow" data-reveal>
            {faq.eyebrow}
          </p>
          <h2 id="faq-title" className={styles.title} data-reveal="title">
            {faq.title}
          </h2>
          <p className={styles.lead} data-reveal>
            {faq.lead}
          </p>
          <div className={styles.help} data-reveal>
            <p className={styles.helpTitle}>{faq.asideTitle}</p>
            <p className={styles.helpText}>{faq.asideText}</p>
            <Link to={faq.contact.href} className="btn btn-primary">
              {faq.contact.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <ul className={styles.list} data-reveal-stagger>
            {faq.items.map((item) => {
              const expanded = open.has(item.id);
              const buttonId = `${baseId}-${item.id}-question`;
              const answerId = `${baseId}-${item.id}-answer`;
              return (
                <li key={item.id} className={styles.item} data-open={expanded || undefined}>
                  <h3 className={styles.heading}>
                    <button
                      id={buttonId}
                      type="button"
                      className={styles.question}
                      aria-expanded={expanded}
                      aria-controls={answerId}
                      onClick={() => toggle(item.id)}
                    >
                      <span>{item.question}</span>
                      <span className={styles.icon} aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={styles.answer}
                    inert={!expanded}
                  >
                    <div className={styles.answerInner}>
                      <p className={styles.answerText}>{item.answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <ProvisionalNote show={faq.provisional}>{faq.note}</ProvisionalNote>
        </div>
      </div>
    </section>
  );
}
