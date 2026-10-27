import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { formatInsightDate } from './insightsDate';
import { ProvisionalNote } from './SectionHeader';
import styles from './Insights.module.css';

type InsightsProps = {
  insights: HomeContent['insights'];
};

type Filter = 'all' | HomeContent['insights']['items'][number]['kind'];

const FILTERS: Filter[] = ['all', 'eclairage', 'actualite'];

/**
 * Section « Éclairages et actualités », à la manière des pages « Insights » des grands
 * cabinets : filtres, puis une publication à la une (grande image), deux cartes compactes
 * à côté, et des cartes à image dessous. Chaque carte est entièrement cliquable (le lien
 * du titre la couvre). Photos sans texte dessus. Sur mobile, les cartes forment une rangée
 * qu'on fait glisser (voir le CSS) ; un changement de filtre la ramène au début.
 */
export function Insights({ insights }: InsightsProps) {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const listRef = useRef<HTMLUListElement>(null);
  const items = insights.items.filter((item) => filter === 'all' || item.kind === filter);

  return (
    <section className={styles.section} aria-labelledby="insights-title">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.heading}>
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

        <div role="group" aria-label={insights.filtersLabel} className={styles.filters} data-reveal>
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              className={styles.filter}
              aria-pressed={filter === value}
              onClick={() => {
                setFilter(value);
                if (listRef.current) listRef.current.scrollLeft = 0;
              }}
            >
              {insights.filters[value]}
            </button>
          ))}
        </div>

        <ul ref={listRef} className={styles.grid} data-reveal-stagger data-lenis-prevent-horizontal>
          {items.map((item, i) => {
            const variant = i === 0 ? styles.featured : i < 3 ? styles.compact : styles.standard;
            return (
              // Clé liée au filtre : les cartes rejouent leur apparition à chaque changement.
              <li
                key={`${filter}-${item.id}`}
                className={cx(styles.card, variant)}
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
                  {i === 0 && <p className={styles.excerpt}>{item.excerpt}</p>}
                  <p className={styles.meta}>
                    <time dateTime={item.date}>{formatInsightDate(item.date, lang)}</time>
                    {i === 0 && item.author && <span>{item.author}</span>}
                  </p>
                  {i === 0 && (
                    <span className={styles.more} aria-hidden="true">
                      {insights.readMore}
                      <ArrowRightIcon size={16} className="arrow" />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

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
