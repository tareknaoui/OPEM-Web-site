import { useId } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent } from '../content';
import styles from './Insights.module.css';

type InsightsProps = {
  insights: HomeContent['insights'];
};

/**
 * « Éclairages », maquette validée par OPEM : titre et lien vers tous les éclairages, trois
 * articles en cartes (filet de couleur en haut), une invitation à poser une question, puis un
 * encadré bleu nuit « Actualité » (formations du mois avec leurs thèmes, nouvelles du cabinet).
 */
export function Insights({ insights }: InsightsProps) {
  const ids = useId();
  const { news } = insights;

  return (
    <section className={styles.section} aria-labelledby="insights-title">
      <div className="container">
        <div className={styles.wrap}>
          <header className={styles.header}>
            <div className={styles.heading}>
              <p className={styles.eyebrow} data-reveal>
                {insights.eyebrow}
              </p>
              <h2 id="insights-title" className={styles.title} data-reveal="title">
                {insights.title}
              </h2>
            </div>
            <Link to={insights.all.href} className={`btn btn-primary ${styles.cta}`} data-reveal>
              {insights.all.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </header>

          <ul className={styles.articles} data-reveal-stagger>
            {insights.articles.map((article) => (
              <li key={article.id} className={styles.article} data-tone={article.tone}>
                <p className={styles.label}>
                  <span className={styles.kind}>{insights.articleLabel}</span>
                  <span className={styles.category}> | {article.category}</span>
                </p>
                <h3 id={`${ids}-${article.id}`} className={styles.articleTitle}>
                  {article.title}
                </h3>
                <p className={styles.articleText}>{article.text}</p>
                <div className={styles.articleFoot}>
                  <p className={styles.meta}>
                    <time dateTime={article.date}>{article.dateLabel}</time>
                  </p>
                  <Link
                    to={article.href}
                    className={styles.read}
                    aria-describedby={`${ids}-${article.id}`}
                  >
                    {insights.read}
                    <ArrowRightIcon size={16} className="arrow" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <p className={styles.question} data-reveal>
            {insights.question.text}{' '}
            <Link to={insights.question.link.href} className={styles.questionLink}>
              {insights.question.link.label}
              <ArrowRightIcon size={16} className="arrow" />
            </Link>
          </p>

          <aside className={styles.news} aria-labelledby={`${ids}-news`} data-reveal>
            <div className={styles.newsHead}>
              <p id={`${ids}-news`} className={styles.badge}>
                {news.label}
              </p>
              <Link to={news.all.href} className={styles.newsLink}>
                {news.all.label}
                <ArrowRightIcon size={16} className="arrow" />
              </Link>
            </div>
            {news.items.map((item) => (
              <div key={item.id} className={styles.newsItem}>
                <div className={styles.newsBody}>
                  <p className={styles.newsDate}>
                    <time dateTime={item.date}>{item.dateLabel}</time>
                  </p>
                  <p id={`${ids}-${item.id}`} className={styles.newsTitle}>
                    {item.title}
                  </p>
                  {item.tags && (
                    <ul className={styles.tags}>
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <Link
                  to={item.link.href}
                  className={item.tags ? styles.newsButton : styles.newsLink}
                  aria-describedby={`${ids}-${item.id}`}
                >
                  {item.link.label}
                  <ArrowRightIcon size={16} className="arrow" />
                </Link>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
