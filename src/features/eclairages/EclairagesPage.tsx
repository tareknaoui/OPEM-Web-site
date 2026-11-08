import { useId } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { homeContent, type HomeContent } from '@/features/home/content';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { ARTICLE_THEMES, eclairagesContent } from './content';
import styles from './EclairagesPage.module.css';
import { Subscribe } from './Subscribe';

type Article = HomeContent['insights']['articles'][number];

const srcSet = (image: string) => `${image.replace(/\.webp$/, '-700.webp')} 700w, ${image} 1200w`;

/**
 * Page « Éclairages », dans l'esprit des pages d'analyses des grands cabinets : un bandeau bleu
 * nuit avec le titre et la barre des thèmes (les six domaines de l'accueil, plus l'IA) ;
 * l'éclairage « À la une » en grande carte, puis les autres en grille ; l'inscription aux
 * éclairages ; trois questions fréquentes. Le thème choisi s'inscrit dans l'adresse
 * (?theme=formations), pour qu'on puisse la partager. Articles et questions : ceux de l'accueil.
 */
export default function EclairagesPage() {
  const { lang } = useLanguage();
  const home = homeContent[lang];
  const t = eclairagesContent[lang];
  const { insights, faq } = home;
  const ids = useId();
  const [params, setParams] = useSearchParams();

  const themes = [
    ...home.domains.items.map((domain) => ({ id: domain.id, label: domain.title })),
    { id: 'ia', label: t.ia },
  ];
  const themeOf = (article: Article) => ARTICLE_THEMES[article.id] ?? '';
  const countOf = (theme: string) =>
    insights.articles.filter((article) => themeOf(article) === theme).length;
  const requested = params.get('theme') ?? '';
  const current = themes.some((theme) => theme.id === requested) ? requested : '';
  const articles = current
    ? insights.articles.filter((article) => themeOf(article) === current)
    : insights.articles;
  const [featured, ...others] = articles;

  const choose = (theme: string) =>
    setParams(theme ? { theme } : {}, { replace: true, preventScrollReset: true });

  const label = (article: Article) => (
    <p className={styles.label}>
      <span className={styles.kind}>{insights.articleLabel}</span>
      <span> | {article.category}</span>
    </p>
  );

  return (
    <div className={styles.page}>
      <title>{`${insights.eyebrow} · ${env.appName}`}</title>

      {/* ---------- Bandeau : titre et thèmes ---------- */}
      <header className={cx(styles.masthead, 'on-dark')}>
        <div className="container">
          <p className={styles.eyebrow}>{insights.eyebrow}</p>
          <h1 className={styles.title}>{insights.title}</h1>
          <p className={styles.intro}>{t.intro}</p>

          <nav className={styles.themes} aria-label={t.themesLabel}>
            <label htmlFor={`${ids}-theme`} className={styles.themesLabel}>
              {t.themesLabel}
            </label>
            {/* Téléphone : une liste déroulante ; ailleurs, des pastilles. */}
            <select
              id={`${ids}-theme`}
              className={styles.themeSelect}
              value={current}
              onChange={(event) => choose(event.target.value)}
            >
              {[{ id: '', label: t.allThemes }, ...themes].map((theme) => (
                <option key={theme.id || 'tous'} value={theme.id}>
                  {`${theme.label} (${theme.id ? countOf(theme.id) : insights.articles.length})`}
                </option>
              ))}
            </select>
            <ul className={styles.chips}>
              {[{ id: '', label: t.allThemes }, ...themes].map((theme) => {
                const count = theme.id ? countOf(theme.id) : insights.articles.length;
                return (
                  <li key={theme.id || 'tous'}>
                    <button
                      type="button"
                      className={styles.chip}
                      aria-pressed={current === theme.id}
                      onClick={() => choose(theme.id)}
                    >
                      {theme.label}
                      <span className={styles.chipCount} aria-hidden="true">
                        {count}
                      </span>
                      <span className="sr-only">{` (${t.count(count)})`}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* ---------- À la une, puis les autres éclairages ---------- */}
      <div className="container" key={current || 'tous'}>
        <div className={styles.results} aria-live="polite">
          {featured ? (
            <article className={styles.featured} data-tone={featured.tone}>
              <Link
                to={featured.href}
                className={styles.featuredMedia}
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  src={featured.image}
                  srcSet={srcSet(featured.image)}
                  sizes="(min-width: 64em) 44rem, 100vw"
                  width={1200}
                  height={800}
                  alt=""
                  decoding="async"
                />
              </Link>
              <div className={styles.featuredBody}>
                <p className={styles.featuredBadge}>{t.featured}</p>
                {label(featured)}
                <h2 id={`${ids}-featured`} className={styles.featuredTitle}>
                  <Link to={featured.href}>{featured.title}</Link>
                </h2>
                <p className={styles.featuredText}>{featured.text}</p>
                <div className={styles.foot}>
                  <time dateTime={featured.date} className={styles.date}>
                    {featured.dateLabel}
                  </time>
                  <Link
                    to={featured.href}
                    className={styles.read}
                    aria-describedby={`${ids}-featured`}
                  >
                    {t.readMore}
                    <ArrowRightIcon size={16} className="arrow" />
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>{t.empty.title}</p>
              <p>{t.empty.text}</p>
              <Link to={insights.question.link.href} className="btn btn-primary">
                {insights.question.link.label}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
            </div>
          )}

          {others.length > 0 && (
            <section aria-labelledby={`${ids}-latest`} className={styles.latest}>
              <div className={styles.latestHead}>
                <h2 id={`${ids}-latest`} className={styles.latestTitle}>
                  {t.latest}
                </h2>
                <p className={styles.latestCount}>{t.count(articles.length)}</p>
              </div>
              <ul className={styles.grid}>
                {others.map((article) => (
                  <li key={article.id} className={styles.card} data-tone={article.tone}>
                    <div className={styles.cardMedia}>
                      <img
                        src={article.image}
                        srcSet={srcSet(article.image)}
                        sizes="(min-width: 64em) 24rem, (min-width: 48em) 45vw, 90vw"
                        width={1200}
                        height={800}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    {label(article)}
                    <h3 id={`${ids}-${article.id}`} className={styles.cardTitle}>
                      <Link to={article.href}>{article.title}</Link>
                    </h3>
                    <p className={styles.cardText}>{article.text}</p>
                    <div className={styles.foot}>
                      <time dateTime={article.date} className={styles.date}>
                        {article.dateLabel}
                      </time>
                      <span className={styles.read} aria-hidden="true">
                        {insights.read}
                        <ArrowRightIcon size={16} className="arrow" />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <Subscribe content={t.subscribe} />

      {/* ---------- Vos questions, nos réponses ---------- */}
      <section className={styles.faq} aria-labelledby={`${ids}-faq`}>
        <div className={cx('container', styles.faqInner)}>
          <div className={styles.faqHead}>
            <p className={styles.sectionEyebrow}>{faq.eyebrow}</p>
            <h2 id={`${ids}-faq`} className={styles.sectionTitle}>
              {faq.title}
            </h2>
            <p className={styles.faqFoot}>
              {faq.footText}{' '}
              <Link to={faq.contact.href} className={styles.faqLink}>
                {faq.contact.label}
              </Link>
            </p>
          </div>
          <div className={styles.questions}>
            {faq.items.slice(0, 3).map((item) => (
              <details key={item.id} className={styles.question}>
                <summary>
                  <span>{item.question}</span>
                  <span className={styles.plus} aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
