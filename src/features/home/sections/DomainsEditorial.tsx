import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CheckIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { useOffscreen } from '@/hooks/useOffscreen';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import { mergeRefs } from '@/lib/mergeRefs';
import type { HomeContent } from '../content';
import styles from './DomainsEditorial.module.css';

type DomainsEditorialProps = {
  domains: HomeContent['domains'];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * « Nos domaines », version sommaire éditorial (esprit rapport annuel) : sur bleu nuit, à
 * gauche le sommaire des domaines en grandes lignes numérotées ; la ligne active s'ouvre
 * (phrase, points, liens) et un filet blanc s'y remplit. À droite, une grande photo qui se
 * dévoile puis zoome lentement. À la fin du filet (animationend), domaine suivant.
 * Pause : bouton, navigation au clavier, section hors de l'écran (pas au survol : la
 * souris qui passe le faisait s'arrêter et repartir) ; aucun défilement si l'utilisateur
 * a demandé moins d'animations. Lignes = titres (h3) contenant le bouton (motif accordéon).
 */
export function DomainsEditorial({ domains }: DomainsEditorialProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = domains.items.length;
  const preload = usePreloadImages<HTMLElement>(domains.items.map((item) => item.image));
  const offscreen = useOffscreen<HTMLElement>();
  const sectionRef = useMemo(() => mergeRefs(preload, offscreen), [preload, offscreen]);

  const select = (next: number, focusTrigger = false) => {
    const wrapped = (next + count) % count;
    setIndex(wrapped);
    if (focusTrigger) triggers.current[wrapped]?.focus();
  };

  // Sommaire vertical : flèches haut / bas, Début, Fin.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = {
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
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="domains-title"
      data-paused={paused || undefined}
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.index}>
          <p className={styles.eyebrow} data-reveal>
            OPEM · Beyond Quality
          </p>
          <h2 id="domains-title" className={styles.title} data-reveal="title">
            {domains.title}
          </h2>

          <ol className={styles.list} data-reveal-stagger>
            {domains.items.map((item, i) => {
              const active = i === index;
              const detailsId = `${baseId}-details-${i}`;
              return (
                <li key={item.id} className={styles.row} data-active={active || undefined}>
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

                  <div id={detailsId} className={styles.details} hidden={!active}>
                    <p className={styles.text}>{item.text}</p>
                    <ul className={styles.points}>
                      {item.points.map((point) => (
                        <li key={point} className={styles.point}>
                          <CheckIcon size={16} className={styles.check} />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.actions}>
                      <Link to={item.href} className={styles.discover}>
                        {domains.discover}
                        <ArrowRightIcon size={16} className="arrow" />
                      </Link>
                      <Link to={domains.callback.href} className="btn btn-light">
                        {domains.callback.label}
                      </Link>
                    </div>
                  </div>

                  {/* Filet de progression (l'avancement est déjà dit par le compteur). */}
                  {active && (
                    <span className={styles.track} aria-hidden="true">
                      <span
                        key={`${item.id}-${index}`}
                        className={styles.fill}
                        onAnimationEnd={() => select(index + 1)}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className={styles.visual}>
          {/* Photos sans texte dessus (charte), superposées pour le fondu. */}
          <div className={styles.stage} data-reveal="image">
            {domains.items.map((item, i) => (
              <div key={item.id} className={styles.frame} data-active={i === index || undefined}>
                <img
                  className={styles.image}
                  src={item.image}
                  alt=""
                  width={1280}
                  height={960}
                  loading={i === 0 ? undefined : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          <div className={styles.meta} data-reveal>
            <p className={styles.counter} aria-live="polite">
              <span className="sr-only">
                {domains.counter
                  .replace('{current}', String(index + 1))
                  .replace('{total}', String(count))}
              </span>
              <span aria-hidden="true">
                <span className={styles.counterCurrent}>{pad(index + 1)}</span>
                <span className={styles.counterTotal}> — {pad(count)}</span>
              </span>
            </p>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.roundButton}
                aria-label={paused ? domains.play : domains.pause}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
              </button>
              <button
                type="button"
                className={styles.roundButton}
                aria-label={domains.previous}
                onClick={() => select(index - 1)}
              >
                <ArrowRightIcon size={20} className={styles.previousIcon} />
              </button>
              <button
                type="button"
                className={styles.roundButton}
                aria-label={domains.next}
                onClick={() => select(index + 1)}
              >
                <ArrowRightIcon size={20} className={styles.nextIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
