import { useId, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import styles from './Faq.module.css';

type FaqProps = {
  faq: HomeContent['faq'];
};

type Theme = HomeContent['faq']['themes'][number]['id'];

const formatNumber = (index: number) => String(index + 1).padStart(2, '0');

/**
 * Questions fréquentes, dernière section de l'accueil (maquette validée par OPEM) : sur bleu
 * nuit, des filtres par thème, la liste numérotée des questions et, à côté, la réponse choisie
 * sur un panneau blanc. Une seule réponse à la fois ; changer de thème affiche sa première
 * question. Sur téléphone et tablette, le panneau s'insère sous la question choisie.
 */
export function Faq({ faq }: FaqProps) {
  const [theme, setTheme] = useState<Theme>('tout');
  const [activeIndex, setActiveIndex] = useState(0);
  const panelId = useId();
  const active = faq.items[activeIndex]!;

  const selectTheme = (next: Theme) => {
    setTheme(next);
    setActiveIndex(faq.items.findIndex((item) => next === 'tout' || item.theme === next));
  };

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className="container">
        <div className={styles.wrap}>
          <header className={styles.header}>
            <p className={styles.eyebrow} data-reveal>
              {faq.eyebrow}
            </p>
            <h2 id="faq-title" className={styles.title} data-reveal="title">
              {faq.title}
            </h2>
          </header>

          <div className={styles.themes} role="group" aria-label={faq.themesLabel} data-reveal>
            {faq.themes.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={styles.theme}
                aria-pressed={theme === id}
                onClick={() => selectTheme(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.body} data-reveal>
            <div className={styles.list}>
              {faq.items.map((item, index) =>
                theme === 'tout' || item.theme === theme ? (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.question}
                    style={{ order: index * 2 }}
                    aria-pressed={index === activeIndex}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className={styles.questionNumber}>{formatNumber(index)}</span>
                    <span className={styles.questionText}>{item.question}</span>
                  </button>
                ) : null,
              )}
            </div>

            <article
              id={panelId}
              className={styles.panel}
              style={{ order: activeIndex * 2 + 1 }}
              aria-live="polite"
            >
              <p className={styles.panelNumber} aria-hidden="true">
                {formatNumber(activeIndex)}
              </p>
              <h3 className={styles.panelTitle}>{active.question}</h3>
              <p className={styles.answer}>{active.answer}</p>
              <div className={styles.foot}>
                <p>{faq.footText}</p>
                <Link to={faq.contact.href} className={`btn ${styles.contact}`}>
                  {faq.contact.label}
                  <ArrowRightIcon size={18} className="arrow" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
