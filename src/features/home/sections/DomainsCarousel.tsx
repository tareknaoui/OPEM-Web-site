import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import type { HomeContent } from '../content';
import styles from './DomainsCarousel.module.css';

type DomainsCarouselProps = {
  domains: HomeContent['domains'];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * « Nos domaines », version carrousel à panneaux : sur ordinateur, les cinq domaines sont
 * côte à côte en bandes bleu nuit numérotées ; le domaine actif s'ouvre en grand panneau
 * blanc (photo | texte). Sur mobile : accordéon vertical. Pas de défilement automatique.
 * Chaque bande est le titre (h3) du domaine et contient le bouton qui l'ouvre (motif
 * accordéon) ; flèches du clavier, Début, Fin (miroir en arabe), précédent / suivant.
 */
export function DomainsCarousel({ domains }: DomainsCarouselProps) {
  const [index, setIndex] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = domains.items.length;
  const preload = usePreloadImages<HTMLElement>(domains.items.map((item) => item.image));

  // Les flèches font le tour : après le dernier domaine, on revient au premier.
  const select = (next: number, focusTrigger = false) => {
    const wrapped = (next + count) % count;
    setIndex(wrapped);
    if (focusTrigger) triggers.current[wrapped]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const rtl = document.documentElement.dir === 'rtl';
    const keys: Record<string, number> = {
      ArrowRight: rtl ? i - 1 : i + 1,
      ArrowLeft: rtl ? i + 1 : i - 1,
      ArrowDown: i + 1,
      ArrowUp: i - 1,
      Home: 0,
      End: count - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <section ref={preload} className={styles.section} aria-labelledby="domains-title">
      <div className="container">
        <div className={styles.header}>
          <h2 id="domains-title" className={styles.title} data-reveal="title">
            {domains.title}
          </h2>

          <div className={styles.controls} data-reveal>
            <p className={styles.counter} aria-live="polite">
              <span className="sr-only">
                {domains.counter
                  .replace('{current}', String(index + 1))
                  .replace('{total}', String(count))}
              </span>
              <span aria-hidden="true">
                <span className={styles.counterCurrent}>{pad(index + 1)}</span>
                <span className={styles.counterTotal}> / {pad(count)}</span>
              </span>
            </p>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label={domains.previous}
              onClick={() => select(index - 1)}
            >
              <ArrowRightIcon size={20} className={styles.previousIcon} />
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label={domains.next}
              onClick={() => select(index + 1)}
            >
              <ArrowRightIcon size={20} className={styles.nextIcon} />
            </button>
          </div>
        </div>

        <ul className={styles.track} data-reveal-stagger>
          {domains.items.map((item, i) => {
            const active = i === index;
            const detailsId = `${baseId}-details-${i}`;
            return (
              <li key={item.id} className={styles.panel} data-active={active || undefined}>
                <div className={styles.inner}>
                  {/* Photo sans texte dessus (charte). Provisoire : à remplacer. */}
                  <img
                    className={styles.image}
                    src={item.image}
                    alt=""
                    width={1280}
                    height={960}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.text}>
                    <h3 className={styles.heading}>
                      <button
                        ref={(element) => {
                          triggers.current[i] = element;
                        }}
                        type="button"
                        className={styles.trigger}
                        aria-expanded={active}
                        aria-controls={detailsId}
                        onClick={() => select(i)}
                        onKeyDown={(event) => handleKeyDown(event, i)}
                      >
                        <span className={styles.number}>{pad(i + 1)}</span>
                        <span className={styles.label}>{item.title}</span>
                      </button>
                    </h3>
                    <div id={detailsId} className={styles.details}>
                      <p className={styles.description}>{item.text}</p>
                      <ul className={styles.points}>
                        {item.points.map((point) => (
                          <li key={point} className={styles.point}>
                            <CheckIcon size={18} className={styles.check} />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className={styles.actions}>
                        <Link to={item.href} className={styles.discover}>
                          {domains.discover}
                          <ArrowRightIcon size={16} className="arrow" />
                        </Link>
                        <Link to={domains.callback.href} className="btn btn-primary">
                          {domains.callback.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Barre d'avancement en segments (l'information est déjà dans le compteur). */}
        <div className={styles.progress} aria-hidden="true" data-reveal>
          {domains.items.map((item, i) => (
            <span key={item.id} className={styles.segment} data-active={i === index || undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
