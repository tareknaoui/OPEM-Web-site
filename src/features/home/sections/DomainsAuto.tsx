import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CheckIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { useOffscreen } from '@/hooks/useOffscreen';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import { mergeRefs } from '@/lib/mergeRefs';
import type { HomeContent } from '../content';
import styles from './DomainsAuto.module.css';

type DomainsAutoProps = {
  domains: HomeContent['domains'];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * « Nos domaines », version carrousel animé : sur fond bleu OPEM, une grande carte blanche
 * (photo qui zoome lentement | texte), puis une ligne d'onglets dont la barre se remplit
 * pendant l'affichage du domaine ; à la fin de la barre (événement animationend), on passe
 * au suivant. Le défilement s'arrête avec le bouton pause, pendant la navigation au
 * clavier et quand la section n'est pas à l'écran (pas au survol : la souris qui passe
 * le faisait s'arrêter et repartir). Il ne démarre pas si l'utilisateur a demandé moins
 * d'animations (la barre est alors pleine, sans animation). Onglets WAI-ARIA.
 */
export function DomainsAuto({ domains }: DomainsAutoProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = domains.items.length;
  const preload = usePreloadImages<HTMLElement>(domains.items.map((item) => item.image));
  const offscreen = useOffscreen<HTMLElement>();
  const sectionRef = useMemo(() => mergeRefs(preload, offscreen), [preload, offscreen]);
  const current = domains.items[index] ?? domains.items[0];
  if (!current) return null;

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  const select = (next: number, focusTab = false) => {
    const wrapped = (next + count) % count;
    setIndex(wrapped);
    if (focusTab) tabRefs.current[wrapped]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const rtl = document.documentElement.dir === 'rtl';
    const keys: Record<string, number> = {
      ArrowRight: rtl ? index - 1 : index + 1,
      ArrowLeft: rtl ? index + 1 : index - 1,
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
      <div className="container">
        <div className={styles.header}>
          <h2 id="domains-title" className={styles.title} data-reveal="title">
            {domains.title}
          </h2>
          <div className={styles.controls} data-reveal>
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
              aria-controls={panelId}
              onClick={() => select(index - 1)}
            >
              <ArrowRightIcon size={20} className={styles.previousIcon} />
            </button>
            <button
              type="button"
              className={styles.roundButton}
              aria-label={domains.next}
              aria-controls={panelId}
              onClick={() => select(index + 1)}
            >
              <ArrowRightIcon size={20} className={styles.nextIcon} />
            </button>
          </div>
        </div>

        <div className={styles.stage} data-reveal>
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(index)}
            tabIndex={0}
            className={styles.card}
          >
            {/* Photos superposées : la nouvelle apparaît en fondu par-dessus la précédente
                (jamais de blanc). Sans texte dessus (charte). */}
            <div className={styles.media}>
              {domains.items.map((item, i) => (
                <div key={item.id} className={styles.frame} data-active={i === index || undefined}>
                  <img
                    className={styles.image}
                    src={item.image}
                    alt=""
                    width={1280}
                    height={960}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            {/* Clé = domaine : le texte rejoue son entrée à chaque changement. */}
            <div key={`body-${current.id}`} className={styles.body}>
              <span className={styles.bigNumber} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className={styles.domainTitle}>{current.title}</h3>
              <p className={styles.text}>{current.text}</p>
              <ul className={styles.points}>
                {current.points.map((point) => (
                  <li key={point} className={styles.point}>
                    <CheckIcon size={18} className={styles.check} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className={styles.actions}>
                <Link to={current.href} className={styles.discover}>
                  {domains.discover}
                  <ArrowRightIcon size={16} className="arrow" />
                </Link>
                <Link to={domains.callback.href} className="btn btn-primary">
                  {domains.callback.label}
                </Link>
              </div>
            </div>
          </div>

          <div
            role="tablist"
            aria-labelledby="domains-title"
            className={styles.tabs}
            data-reveal-stagger
          >
            {domains.items.map((item, i) => (
              <button
                key={item.id}
                ref={(element) => {
                  tabRefs.current[i] = element;
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={i === index}
                aria-controls={panelId}
                tabIndex={i === index ? 0 : -1}
                className={styles.tab}
                data-done={i < index || undefined}
                onClick={() => select(i)}
                onKeyDown={handleKeyDown}
              >
                <span className={styles.bar} aria-hidden="true">
                  {i === index && (
                    <span
                      key={`${item.id}-${index}`}
                      className={styles.fill}
                      onAnimationEnd={() => select(index + 1)}
                    />
                  )}
                </span>
                <span className={styles.tabNumber}>{pad(i + 1)}</span>
                <span className={styles.tabLabel}>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
