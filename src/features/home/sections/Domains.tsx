import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CheckIcon, ChevronDownIcon } from '@/components/icons';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import type { HomeContent } from '../content';
import styles from './Domains.module.css';

type DomainsProps = {
  domains: HomeContent['domains'];
};

/**
 * Section « Nos domaines » (juste sous l'accroche) : une ligne d'onglets, toujours tous
 * visibles, et un panneau qui affiche UN domaine en entier (photo 4:3 | texte), puis
 * « précédent / suivant » et « 2 sur 5 ». Pas de défilement automatique.
 * Onglets selon le motif WAI-ARIA (flèches, Début, Fin ; miroir en arabe). Sur mobile, les
 * onglets laissent la place à une liste déroulante « Choisir un domaine ».
 */
export function Domains({ domains }: DomainsProps) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = domains.items.length;
  const preload = usePreloadImages<HTMLElement>(domains.items.map((item) => item.image));
  const current = domains.items[index] ?? domains.items[0];
  if (!current) return null;

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  // Les flèches font le tour : après le dernier domaine, on revient au premier.
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
    <section ref={preload} className={styles.section} aria-labelledby="domains-title">
      <div className="container">
        <h2 id="domains-title" className={styles.title} data-reveal="title">
          {domains.title}
        </h2>

        {/* Ordinateur : onglets. */}
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
              onClick={() => select(i)}
              onKeyDown={handleKeyDown}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Mobile : liste déroulante. */}
        <div className={styles.picker} data-reveal>
          <label htmlFor={`${baseId}-select`} className={styles.pickerLabel}>
            {domains.selectLabel}
          </label>
          <span className={styles.selectWrap}>
            <select
              id={`${baseId}-select`}
              className={styles.select}
              value={index}
              onChange={(event) => select(Number(event.target.value))}
            >
              {domains.items.map((item, i) => (
                <option key={item.id} value={i}>
                  {item.title}
                </option>
              ))}
            </select>
            <ChevronDownIcon size={18} className={styles.selectIcon} />
          </span>
        </div>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(index)}
          tabIndex={0}
          className={styles.panel}
          data-reveal
        >
          {/* Photos sans texte dessus (charte), superposées : on passe de l'une à l'autre
              en fondu, sans recharger (jamais de blanc). */}
          <div className={styles.frames}>
            {domains.items.map((item, i) => (
              <img
                key={item.id}
                className={styles.image}
                data-active={i === index || undefined}
                src={item.image}
                alt=""
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <div className={styles.body}>
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

        <div className={styles.pager} data-reveal>
          <button
            type="button"
            className={styles.pagerButton}
            aria-label={domains.previous}
            aria-controls={panelId}
            onClick={() => select(index - 1)}
          >
            <ArrowRightIcon size={20} className={styles.previousIcon} />
          </button>
          <p className={styles.counter} aria-live="polite">
            {domains.counter
              .replace('{current}', String(index + 1))
              .replace('{total}', String(count))}
          </p>
          <button
            type="button"
            className={styles.pagerButton}
            aria-label={domains.next}
            aria-controls={panelId}
            onClick={() => select(index + 1)}
          >
            <ArrowRightIcon size={20} className={styles.nextIcon} />
          </button>
        </div>
      </div>
    </section>
  );
}
