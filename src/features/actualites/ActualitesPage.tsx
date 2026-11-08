import { useId, useRef, type MouseEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { Subscribe } from '@/features/eclairages/Subscribe';
import { homeContent } from '@/features/home/content';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import styles from './ActualitesPage.module.css';
import { actualitesContent } from './content';

/** Taille réelle des grandes versions des photos (la petite, « -700 », fait 700 px de large). */
const SIZES: Record<string, [number, number]> = {
  '/images/sessions/salle-conference': [1600, 1200],
  '/images/sessions/revue-documents': [1600, 1200],
  '/images/sessions/formateur-btph': [1600, 1200],
  '/images/cabinet/ouverture-session': [2400, 1310],
};
const sizeOf = (base: string) => SIZES[base] ?? [1200, 800];

/**
 * Page « Actualités » (/actualites), ouverte par le menu et par « Toutes les actualités » de
 * l'accueil. Les actualités sont celles de l'accueil (homeContent.insights.news), du plus
 * récent au plus ancien ; « En images » montre trois photos de sessions (./content.ts).
 * 01 En-tête, bleu 10 % : titre, chapeau, et le sommaire des actualités (grande date, titre),
 *    chaque entrée descendant en douceur vers sa carte.
 * 02 À la une, blanc : une carte par actualité, son image (photo réelle, ou capture du site dans
 *    un cadre de navigateur) qui se découvre au défilement, sa rubrique, sa date, son titre, ses
 *    thèmes et son lien.
 * 03 Recevoir nos actualités, bleu nuit : l'inscription (composant de la page Éclairages).
 * 04 En images, blanc : trois photos de sessions en planche, légendées.
 * Le bleu nuit ne touche jamais le bandeau bleu OPEM du pied de page : « En images » les sépare.
 */
export default function ActualitesPage() {
  const { lang } = useLanguage();
  const t = actualitesContent[lang];
  const home = homeContent[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);

  // Du plus récent au plus ancien (dates AAAA-MM ou AAAA-MM-JJ, comparables telles quelles).
  const news = [...home.insights.news.items].sort((a, b) => b.date.localeCompare(a.date));
  const photos = t.gallery.photos;
  const cardId = (id: string) => `actualite-${id}`;

  // Une entrée du sommaire mène à sa carte, en douceur, le menu restant visible à l'arrivée.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div ref={pageRef} key={lang} className={styles.page}>
      <title>{`${t.title} · ${env.appName}`}</title>

      {/* ---------- 01 En-tête et sommaire ---------- */}
      <section className={styles.masthead} aria-labelledby={`${ids}-title`}>
        <div className={cx('container', styles.mastheadInner)}>
          <div className={styles.mastheadText}>
            <p className={styles.eyebrow}>{t.masthead.eyebrow}</p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {t.masthead.title}
            </h1>
            <p className={styles.lead}>{t.masthead.lead}</p>
          </div>
          <nav className={styles.index} aria-label={t.masthead.indexLabel}>
            <ol>
              {news.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${cardId(item.id)}`}
                    className={styles.indexLink}
                    onClick={(event) => goTo(event, cardId(item.id))}
                  >
                    <time className={styles.indexDate} dateTime={item.date}>
                      {item.dateLabel}
                    </time>
                    <span className={styles.indexTitle}>{item.title}</span>
                    <ArrowRightIcon size={20} className={cx('arrow', styles.indexArrow)} />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* ---------- 02 À la une ---------- */}
      <section className={styles.list} aria-labelledby={`${ids}-list`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.list.eyebrow}</p>
            <h2 id={`${ids}-list`} className={styles.sectionTitle} data-motion="title">
              {t.list.title}
            </h2>
          </header>
          <ol className={styles.cards}>
            {news.map((item, index) => {
              const media = t.media[item.id];
              return (
                <li
                  key={item.id}
                  id={cardId(item.id)}
                  className={cx(styles.card, index === 0 && styles.cardFirst)}
                  tabIndex={-1}
                  aria-labelledby={`${ids}-${item.id}`}
                >
                  {media && (
                    <div
                      className={cx(styles.media, media.kind === 'screen' && styles.mediaScreen)}
                      data-motion="unveil"
                    >
                      {media.kind === 'screen' ? (
                        <div className={styles.browser}>
                          <span className={styles.browserBar} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                          <img
                            src={`${media.src}-700.webp`}
                            srcSet={`${media.src}-700.webp 700w, ${media.src}.webp 1200w`}
                            sizes="(min-width: 64em) 40vw, 88vw"
                            width={1200}
                            height={750}
                            alt={media.alt}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className={styles.photo} data-parallax>
                          <img
                            src={`${media.src}-700.webp`}
                            srcSet={`${media.src}-700.webp 700w, ${media.src}.webp ${sizeOf(media.src)[0]}w`}
                            sizes="(min-width: 64em) 52vw, 92vw"
                            width={sizeOf(media.src)[0]}
                            height={sizeOf(media.src)[1]}
                            alt={media.alt}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <p className={styles.meta}>
                      {media && <span className={styles.category}>{media.category}</span>}
                      <time dateTime={item.date}>{item.dateLabel}</time>
                    </p>
                    <h3 id={`${ids}-${item.id}`} className={styles.cardTitle}>
                      {item.title}
                    </h3>
                    {item.tags && (
                      <ul className={styles.tags}>
                        {item.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                    <Link
                      to={item.link.href}
                      className={cx(
                        'btn',
                        item.tags ? 'btn-primary' : 'btn-secondary',
                        styles.cardLink,
                      )}
                      aria-describedby={`${ids}-${item.id}`}
                    >
                      {item.link.label}
                      <ArrowRightIcon size={18} className="arrow" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- 03 Recevoir nos actualités ---------- */}
      <Subscribe content={t.subscribe} />

      {/* ---------- 04 En images ---------- */}
      <section className={styles.gallery} aria-labelledby={`${ids}-gallery`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.gallery.eyebrow}</p>
            <h2 id={`${ids}-gallery`} className={styles.sectionTitle} data-motion="title">
              {t.gallery.title}
            </h2>
            <p className={styles.galleryLead}>{t.gallery.lead}</p>
          </header>
          <div className={styles.mosaic}>
            {photos.map((photo, index) => {
              const base = photo.src;
              return (
                <figure key={photo.src} className={styles.tile} data-tile={index}>
                  <div className={styles.tileFrame} data-motion="unveil" data-parallax>
                    <img
                      src={`${base}-700.webp`}
                      srcSet={`${base}-700.webp 700w, ${base}.webp ${sizeOf(base)[0]}w`}
                      sizes="(min-width: 64em) 30vw, (min-width: 40em) 46vw, 92vw"
                      width={sizeOf(base)[0]}
                      height={sizeOf(base)[1]}
                      alt=""
                      style={{ objectPosition: photo.focus }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className={styles.caption}>{photo.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
