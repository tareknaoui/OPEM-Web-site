import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import { AudiencePictogram } from '../icons';
import { ProvisionalNote } from './SectionHeader';
import styles from './Testimonials.module.css';

type TestimonialsProps = {
  testimonials: HomeContent['testimonials'];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Témoignages, dernière section de l'accueil : une grande citation sur carte blanche et, à
 * côté, la liste des témoignages (onglets). Pas de défilement automatique : on lit à son
 * rythme. Pas de photo de personne (un pictogramme indique le type d'organisme).
 * Clavier : flèches (inversées en arabe), Début, Fin.
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = testimonials.items.length;

  const select = (next: number, focusTab = false) => {
    const wrapped = (next + count) % count;
    setIndex(wrapped);
    const tab = tabs.current[wrapped];
    if (focusTab) tab?.focus();
    // Téléphone : la pastille active reste visible dans la rangée qui défile.
    else tab?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const rtl = document.documentElement.dir === 'rtl';
    const keys: Record<string, number> = {
      ArrowRight: rtl ? index - 1 : index + 1,
      ArrowLeft: rtl ? index + 1 : index - 1,
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: count - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow" data-reveal>
              {testimonials.eyebrow}
            </p>
            <h2 id="testimonials-title" className={styles.title} data-reveal="title">
              {testimonials.title}
            </h2>
          </div>
          <p className={styles.lead} data-reveal>
            {testimonials.lead}
          </p>
        </div>

        <div className={styles.layout}>
          <div
            role="tablist"
            aria-label={testimonials.listLabel}
            className={styles.tabs}
            data-reveal-stagger
          >
            {testimonials.items.map((entry, i) => (
              <button
                key={entry.id}
                ref={(element) => {
                  tabs.current[i] = element;
                }}
                id={`${baseId}-tab-${i}`}
                type="button"
                role="tab"
                className={styles.tab}
                aria-selected={i === index}
                aria-controls={`${baseId}-panel`}
                tabIndex={i === index ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={handleKeyDown}
              >
                <span className={styles.tabNumber} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className={styles.tabText}>
                  <span className={styles.tabDomain}>{entry.domain}</span>
                  <span className={styles.tabOrganisation}>{entry.organisation}</span>
                </span>
              </button>
            ))}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${index}`}
            className={styles.panel}
            data-reveal
          >
            {/* Citations superposées : la carte garde la hauteur de la plus longue. */}
            <div className={styles.stage}>
              {testimonials.items.map((entry, i) => (
                <Quote key={entry.id} item={entry} active={i === index} />
              ))}
            </div>

            <div className={styles.controls}>
              <p className={styles.counter} aria-live="polite">
                <span className="sr-only">
                  {testimonials.counter
                    .replace('{current}', String(index + 1))
                    .replace('{total}', String(count))}
                </span>
                <span aria-hidden="true">
                  <span className={styles.counterCurrent}>{pad(index + 1)}</span>
                  <span className={styles.counterTotal}> — {pad(count)}</span>
                </span>
              </p>
              <div className={styles.arrows}>
                <button
                  type="button"
                  className={styles.arrow}
                  aria-label={testimonials.previous}
                  onClick={() => select(index - 1)}
                >
                  <ArrowRightIcon size={20} className={styles.previousIcon} />
                </button>
                <button
                  type="button"
                  className={styles.arrow}
                  aria-label={testimonials.next}
                  onClick={() => select(index + 1)}
                >
                  <ArrowRightIcon size={20} className={styles.nextIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer} data-reveal>
          <ProvisionalNote show={testimonials.provisional}>{testimonials.note}</ProvisionalNote>
          <Link to={testimonials.link.href} className={styles.link}>
            {testimonials.link.label}
            <ArrowRightIcon size={16} className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

type Testimonial = HomeContent['testimonials']['items'][number];

/** Une citation ; seule la citation active est visible (et lue par les lecteurs d'écran). */
function Quote({ item, active }: { item: Testimonial; active: boolean }) {
  return (
    <figure className={styles.figure} data-active={active || undefined} aria-hidden={!active}>
      <svg
        className={styles.mark}
        viewBox="0 0 48 36"
        width="48"
        height="36"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M0 36V22.5C0 9.7 6.6 2.2 19.8 0l1.9 4.6C14.5 6.6 10.9 10.6 10.6 17H20v19H0Zm28 0V22.5C28 9.7 34.6 2.2 47.8 0l1.9 4.6C42.5 6.6 38.9 10.6 38.6 17H48v19H28Z"
        />
      </svg>
      <p className={styles.domain}>{item.domain}</p>
      <blockquote className={styles.quote}>
        <p>{item.quote}</p>
      </blockquote>
      <figcaption className={styles.author}>
        <span className={styles.avatar}>
          <AudiencePictogram name={item.icon} size={26} />
        </span>
        <span className={styles.identity}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.role}>
            {item.role} · {item.organisation}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
