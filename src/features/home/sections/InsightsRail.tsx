import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { formatInsightDate } from './insightsDate';
import { ProvisionalNote } from './SectionHeader';
import styles from './InsightsRail.module.css';

type InsightsRailProps = {
  insights: HomeContent['insights'];
};

type Filter = 'all' | HomeContent['insights']['items'][number]['kind'];

const FILTERS: Filter[] = ['all', 'eclairage', 'actualite'];

/**
 * « Éclairages et actualités », version rail défilant (esprit « Featured insights » des
 * grands cabinets) : sur bleu très clair, des cartes blanches côte à côte qui défilent au
 * doigt, à la molette ou avec les flèches ; la première, à la une, est deux fois plus large.
 * Une barre sous le rail montre la partie visible. Chaque carte est entièrement cliquable.
 */
export function InsightsRail({ insights }: InsightsRailProps) {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [scroll, setScroll] = useState({ start: 0, size: 1, atStart: true, atEnd: true });
  const rail = useRef<HTMLUListElement>(null);
  const items = insights.items.filter((item) => filter === 'all' || item.kind === filter);

  // Position du rail (scrollLeft est négatif en arabe : on raisonne en valeur absolue).
  const measure = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    const ratio = max > 0 ? Math.abs(element.scrollLeft) / max : 0;
    const size = element.scrollWidth > 0 ? element.clientWidth / element.scrollWidth : 1;
    setScroll({
      start: ratio * (1 - size),
      size,
      atStart: max <= 1 || ratio <= 0.01,
      atEnd: max <= 1 || ratio >= 0.99,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, filter, lang]);

  // Une carte (la dernière, de largeur normale) par clic, dans le sens de lecture.
  const move = (step: 1 | -1) => {
    const element = rail.current;
    const card = element?.lastElementChild;
    if (!element || !(card instanceof HTMLElement)) return;
    const style = getComputedStyle(element);
    const gap = parseFloat(style.columnGap) || 0;
    const dir = style.direction === 'rtl' ? -1 : 1;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({
      left: step * dir * (card.offsetWidth + gap),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  const choose = (value: Filter) => {
    setFilter(value);
    if (rail.current) rail.current.scrollLeft = 0;
  };

  return (
    <section className={styles.section} aria-labelledby="insights-title">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow" data-reveal>
              {insights.eyebrow}
            </p>
            <h2 id="insights-title" className={styles.title} data-reveal="title">
              {insights.title}
            </h2>
          </div>
          <p className={styles.lead} data-reveal>
            {insights.lead}
          </p>
        </div>

        <div className={styles.toolbar} data-reveal>
          <div role="group" aria-label={insights.filtersLabel} className={styles.filters}>
            {FILTERS.map((value) => (
              <button
                key={value}
                type="button"
                className={styles.filter}
                aria-pressed={filter === value}
                onClick={() => choose(value)}
              >
                {insights.filters[value]}
              </button>
            ))}
          </div>
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              aria-label={insights.previous}
              disabled={scroll.atStart}
              onClick={() => move(-1)}
            >
              <ArrowRightIcon size={20} className={styles.previousIcon} />
            </button>
            <button
              type="button"
              className={styles.arrow}
              aria-label={insights.next}
              disabled={scroll.atEnd}
              onClick={() => move(1)}
            >
              <ArrowRightIcon size={20} className={styles.nextIcon} />
            </button>
          </div>
        </div>

        <ul
          ref={rail}
          className={styles.rail}
          onScroll={measure}
          data-reveal-stagger
          data-lenis-prevent-horizontal
        >
          {items.map((item, i) => (
            // Clé liée au filtre : les cartes rejouent leur apparition à chaque changement.
            <li
              key={`${filter}-${item.id}`}
              className={cx(styles.card, i === 0 && styles.featured)}
              data-kind={item.kind}
            >
              <div className={styles.media}>
                <img
                  className={styles.image}
                  src={item.image}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.body}>
                <p className={styles.label}>{item.label}</p>
                <h3 className={styles.cardTitle}>
                  <Link to={item.href} className={styles.link}>
                    {item.title}
                  </Link>
                </h3>
                <p className={styles.excerpt}>{item.excerpt}</p>
                <div className={styles.foot}>
                  <p className={styles.meta}>
                    <time dateTime={item.date}>{formatInsightDate(item.date, lang)}</time>
                    {i === 0 && item.author && <span>{item.author}</span>}
                  </p>
                  <span className={styles.more} aria-hidden="true">
                    <ArrowRightIcon size={18} className={styles.nextIcon} />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Partie visible du rail (information doublée par les flèches). */}
        <div className={styles.progress} aria-hidden="true" data-reveal>
          <span
            className={styles.thumb}
            style={{ '--start': scroll.start, '--size': scroll.size } as CSSProperties}
          />
        </div>

        <div className={styles.footer} data-reveal>
          <ProvisionalNote show={insights.provisional}>{insights.note}</ProvisionalNote>
          <div className={styles.links}>
            {insights.links.map((link) => (
              <Link key={link.href} to={link.href} className={styles.allLink}>
                {link.label}
                <ArrowRightIcon size={16} className="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
