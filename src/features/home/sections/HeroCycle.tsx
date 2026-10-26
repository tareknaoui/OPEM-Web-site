import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CheckIcon, DocumentIcon, PauseIcon, PlayIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { HeroMarkers } from './Hero';
import styles from './HeroCycle.module.css';

type HeroCycleProps = {
  hero: HomeContent['hero'];
  cycle: HomeContent['heroCycle'];
  markers: HomeContent['markers'];
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Bandeau d'accueil « Cycle OPEM » : grand titre, puis la démarche racontée par un
 * schéma (organigramme au centre, cartes autour) qui change à chaque étape.
 * Les étapes défilent seules (barre de progression CSS : à la fin de l'animation,
 * on passe à la suivante). Pause : bouton dédié, survol ou focus clavier.
 * Mouvement réduit : aucune animation, donc aucun défilement automatique.
 */
export function HeroCycle({ hero, cycle, markers }: HeroCycleProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = cycle.phases.length;
  const phase = cycle.phases[index] ?? cycle.phases[0]!;
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  const select = (next: number, focus = false) => {
    const i = (next + count) % count;
    setIndex(i);
    if (focus) tabsRef.current[i]?.focus();
  };

  // Onglets (motif WAI-ARIA) : flèches, Début, Fin. En arabe, les flèches suivent le miroir.
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
    <>
      <section
        className={styles.hero}
        aria-labelledby="hero-title"
        data-paused={paused || undefined}
      >
        <div className={cx('container', styles.top)}>
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-title" className={styles.headline}>
              <span className={styles.line}>
                <span>{cycle.headline[0]}</span>
              </span>{' '}
              <span className={cx(styles.line, styles.accent)}>
                <span>{cycle.headline[1]}</span>
              </span>
            </h1>
          </div>

          <div className={styles.intro}>
            <p className={styles.introText}>{cycle.intro}</p>
            <div className={styles.actions}>
              <Link to={hero.primary.href} className="btn btn-primary">
                {hero.primary.label}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
              <Link to={hero.secondary.href} className="btn btn-secondary">
                {hero.secondary.label}
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.stageWrap}>
          <Decor />

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(index)}
            className={cx('container', styles.stage)}
            data-phase={index}
          >
            <div className={styles.orbit} aria-hidden="true">
              <svg viewBox="0 0 400 400" className={styles.rings}>
                <circle cx="200" cy="200" r="198" className={styles.ringOuter} />
                <circle cx="200" cy="200" r="168" className={styles.ringInner} />
              </svg>
              <span className={styles.satellite} />
              <div className={styles.emblem}>
                <OrgChart />
              </div>
            </div>

            {/* key : les cartes sont recréées à chaque étape, leur animation d'entrée rejoue. */}
            <div key={phase.id} className={styles.cards}>
              <div className={cx(styles.card, styles.focus)}>
                <span className={styles.focusLabel}>{cycle.step}</span>
                <span className={styles.focusNumber}>
                  {pad(index + 1)}
                  <span className={styles.focusTotal}>/{pad(count)}</span>
                </span>
                <span className={styles.focusLabel}>{phase.tab}</span>
              </div>

              <div className={cx(styles.card, styles.checklist)}>
                <p className={styles.cardTitle}>{phase.checklist.title}</p>
                <ul className={styles.checks}>
                  {phase.checklist.items.map((item) => (
                    <li key={item.label} data-done={item.done || undefined}>
                      <span className={styles.checkMark} aria-hidden="true">
                        {item.done && <CheckIcon size={12} strokeWidth={3} />}
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={cx(styles.card, styles.note)}>
                <span className={styles.noteIcon} aria-hidden="true">
                  <DocumentIcon size={20} />
                </span>
                <span className={styles.noteText}>
                  <span className={styles.cardTitle}>{phase.note.title}</span>
                  <span className={styles.noteMeta}>{phase.note.meta}</span>
                </span>
                <span className={styles.chip}>
                  <CheckIcon size={12} strokeWidth={3} />
                  {phase.note.status}
                </span>
              </div>

              <p className={styles.caption}>{phase.caption}</p>
            </div>

            {/* Éléments d'interface esquissés, purement décoratifs. */}
            <span className={cx(styles.sketch, styles.sketchA)} aria-hidden="true" />
            <span className={cx(styles.sketch, styles.sketchB)} aria-hidden="true" />
            <span className={cx(styles.sketch, styles.sketchC)} aria-hidden="true" />
          </div>
        </div>

        <div className={cx('container', styles.controls)}>
          <div role="tablist" aria-label={cycle.label} className={styles.tabs}>
            {cycle.phases.map((item, i) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabsRef.current[i] = node;
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={i === index}
                aria-controls={panelId}
                tabIndex={i === index ? 0 : -1}
                className={styles.tab}
                onClick={() => select(i)}
                onKeyDown={handleKeyDown}
              >
                <span className={styles.tabNumber}>{pad(i + 1)}</span>
                {item.tab}
                <span className={styles.track} aria-hidden="true">
                  {i === index && (
                    <span
                      key={`${item.id}-${index}`}
                      className={styles.progress}
                      onAnimationEnd={() => select(index + 1)}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.pause}
            aria-label={paused ? cycle.play : cycle.pause}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
          </button>
        </div>
      </section>

      <HeroMarkers markers={markers} />
    </>
  );
}

/** Organigramme au trait : ses cases se remplissent au fil des étapes (CSS, data-phase). */
function OrgChart() {
  return (
    <svg viewBox="0 0 200 150" className={styles.chart}>
      <g className={styles.links}>
        <path d="M100 38v18M36 56h128M36 56v14M100 56v14M164 56v14M100 96v14M70 110h60M70 110v8M130 110v8" />
      </g>
      <rect x="72" y="12" width="56" height="26" rx="4" className={cx(styles.box, styles.box1)} />
      <rect x="12" y="70" width="48" height="26" rx="4" className={cx(styles.box, styles.box2)} />
      <rect x="76" y="70" width="48" height="26" rx="4" className={cx(styles.box, styles.box2)} />
      <rect x="140" y="70" width="48" height="26" rx="4" className={cx(styles.box, styles.box2)} />
      <rect x="48" y="118" width="44" height="22" rx="4" className={cx(styles.box, styles.box3)} />
      <rect x="108" y="118" width="44" height="22" rx="4" className={cx(styles.box, styles.box3)} />
      <g className={styles.badge}>
        <circle cx="128" cy="14" r="9" />
        <path d="m124 14 3 3 5-6" />
      </g>
    </svg>
  );
}

/** Tracés au trait des bords (courbes qui convergent vers les onglets, chemin pointillé). */
function Decor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      <svg viewBox="0 0 220 120" className={styles.path}>
        <path d="M0 110 C 60 110, 90 40, 150 30 S 200 20, 212 18" />
        <circle cx="212" cy="18" r="5" />
      </svg>
      <svg viewBox="0 0 400 160" className={cx(styles.curves, styles.curvesStart)}>
        <path d="M0 20 H120 C 200 20, 220 140, 320 140 H400" />
        <path d="M0 60 H90 C 170 60, 200 140, 300 140" />
        <path d="M0 100 H60 C 130 100, 170 140, 260 140" />
        <circle cx="396" cy="140" r="4" />
      </svg>
      <svg viewBox="0 0 400 160" className={cx(styles.curves, styles.curvesEnd)}>
        <path d="M0 20 H120 C 200 20, 220 140, 320 140 H400" />
        <path d="M0 60 H90 C 170 60, 200 140, 300 140" />
        <path d="M0 100 H60 C 130 100, 170 140, 260 140" />
        <circle cx="396" cy="140" r="4" />
      </svg>
    </div>
  );
}
