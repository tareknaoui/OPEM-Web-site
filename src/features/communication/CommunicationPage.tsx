import { BinocularsIcon } from '@phosphor-icons/react/dist/csr/Binoculars';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { QuotesIcon } from '@phosphor-icons/react/dist/csr/Quotes';
import { StackIcon } from '@phosphor-icons/react/dist/csr/Stack';
import { TranslateIcon } from '@phosphor-icons/react/dist/csr/Translate';
import { useEffect, useId, useRef, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { ArrowRightIcon } from '@/components/icons';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { ContactBand } from '@/features/contact/ContactBand';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { communicationContent, WORKS_ID, type Photo as PhotoData } from './content';
import styles from './CommunicationPage.module.css';

const REASON_ICONS = [BinocularsIcon, StackIcon, TranslateIcon];
const count = (index: number) => String(index + 1).padStart(2, '0');

/** Une photo en deux tailles (800 px, puis 1600 px ou la largeur indiquée), au format 3:2. */
function Photo({
  photo,
  sizes,
  priority = false,
}: {
  photo: PhotoData;
  sizes: string;
  priority?: boolean;
}) {
  const large = photo.width ?? 1600;
  const smallWidth = photo.small.includes('-700') ? 700 : 800;
  return (
    <img
      src={photo.small}
      srcSet={`${photo.small} ${smallWidth}w, ${photo.src} ${large}w`}
      sizes={sizes}
      alt={photo.alt}
      width={large}
      height={Math.round((large * 2) / 3)}
      {...(priority
        ? { fetchPriority: 'high' as const }
        : { loading: 'lazy' as const, decoding: 'async' as const })}
    />
  );
}

/** Une capture d'écran dans une fenêtre de navigateur (trois pastilles, une barre d'adresse). */
function BrowserFrame({ photo, sizes }: { photo: PhotoData; sizes: string }) {
  return (
    <div className={styles.browser}>
      <div className={styles.browserBar} aria-hidden="true">
        <span />
        <span />
        <span />
        <i className={styles.browserAddress} />
      </div>
      <img
        src={photo.small}
        srcSet={`${photo.small} 700w, ${photo.src} 1200w`}
        sizes={sizes}
        alt={photo.alt}
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Page « Communication institutionnelle » (/expertises/communication-institutionnelle) :
 * 01 Haut de page, bleu 10 % : l'accroche, la promesse, deux boutons, la signature ; à droite,
 *    une photo jusqu'au bord de l'écran (comme les autres pages d'expertise). Dessous, un
 *    bandeau de grands mots qui défile (les sept savoir-faire).
 * 02 Notre conviction, blanc : une phrase qui s'allume mot à mot au défilement.
 * 03 Ce que nous créons, bleu 10 % : les sept savoir-faire en mosaïque (deux en vedette,
 *    dont les sites web, montrés par le site d'OPEM) ; chacun porte l'ancre de sa
 *    sous-rubrique du menu.
 * 04 Nos réalisations, blanc : les catalogues de la SAPTA et de la SNTP (leurs logos), puis le
 *    site d'OPEM (sa capture dans une fenêtre de navigateur).
 * 05 Conviction, bleu nuit : une photo et la phrase qui fonde le métier.
 * 06 Notre méthode, blanc : cinq étapes reliées par un fil.
 * 07 Pourquoi nous, bleu 10 % : trois raisons et leurs pictogrammes.
 * 08 Questions fréquentes, blanc ; 09 Premier échange (ContactBand).
 * Textes : ./content.ts. Mouvement : celui de « Le cabinet » (titres, photos, mots).
 */
export default function CommunicationPage() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const t = communicationContent[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);

  // Arrivée par une sous-rubrique (/…/sites-web) : la page descend jusqu'au savoir-faire.
  useEffect(() => {
    const sub = pathname.split('/')[3];
    const target = sub && document.getElementById(sub);
    if (!target) return;
    const frame = requestAnimationFrame(() => scrollToElement(target));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const jump = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
  };

  const siteScreen = t.works.items.find((work) => work.screen)?.screen;

  return (
    <div ref={pageRef} key={lang} className={styles.page}>
      <title>{`${t.title} · ${env.appName}`}</title>

      {/* ---------- 01 Haut de page ---------- */}
      <section className={styles.hero} aria-labelledby={`${ids}-title`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className={styles.trail}>
              <Link to={t.hero.trail.href}>{t.hero.trail.label}</Link>
              <span aria-hidden="true">/</span>
              <span>{t.hero.eyebrow}</span>
            </p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {t.hero.title}
            </h1>
            <span className={styles.titleBar} aria-hidden="true" />
            <p className={styles.lead}>{t.hero.lead}</p>
            <div className={styles.actions}>
              <Link to={QUOTE_HREF} className={styles.primary}>
                {t.hero.primary}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
              <a href={`#${WORKS_ID}`} className={styles.secondary} onClick={jump(WORKS_ID)}>
                {t.hero.secondary}
              </a>
            </div>
            <p className={styles.signature}>{t.hero.signature}</p>
          </div>
          <div className={styles.heroPhoto} data-motion="unveil">
            <Photo photo={t.hero.photo} sizes="(min-width: 60em) 50vw, 100vw" priority />
          </div>
        </div>
      </section>

      {/* Les sept savoir-faire en grands mots qui défilent (décoratif : ils sont listés plus bas). */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[0, 1].map((copy) => (
            <p key={copy} className={styles.tickerRow}>
              {t.ticker.map((word) => (
                <span key={word} className={styles.tickerWord}>
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* ---------- 02 Notre conviction ---------- */}
      <section className={styles.manifesto} aria-labelledby={`${ids}-manifesto`}>
        <div className={cx('container', styles.manifestoInner)}>
          <h2 id={`${ids}-manifesto`} className={styles.eyebrow}>
            {t.manifesto.eyebrow}
          </h2>
          <p className={styles.statement} data-motion="words">
            {t.manifesto.text}
          </p>
        </div>
      </section>

      {/* ---------- 03 Ce que nous créons ---------- */}
      <section className={styles.crafts} aria-labelledby={`${ids}-crafts`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.crafts.eyebrow}</p>
            <h2 id={`${ids}-crafts`} className={styles.sectionTitle} data-motion="title">
              {t.crafts.title}
            </h2>
          </header>
          <ul className={styles.bento}>
            {t.crafts.items.map((craft, index) => (
              <li key={craft.id} id={craft.id} className={styles.tile}>
                <div className={styles.tileMedia}>
                  {craft.screen && siteScreen ? (
                    <div className={styles.tileScreen}>
                      <BrowserFrame photo={siteScreen} sizes="(min-width: 64em) 45vw, 100vw" />
                    </div>
                  ) : (
                    craft.photo && (
                      <Photo
                        photo={craft.photo}
                        sizes={
                          index < 2
                            ? '(min-width: 64em) 45vw, 100vw'
                            : '(min-width: 64em) 30vw, 100vw'
                        }
                      />
                    )
                  )}
                </div>
                <div className={styles.tileText}>
                  <p className={styles.tileNumber}>{count(index)}</p>
                  <h3 className={styles.tileTitle}>{craft.title}</h3>
                  <p className={styles.tileBody}>{craft.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 04 Nos réalisations ---------- */}
      <section id={WORKS_ID} className={styles.works} aria-labelledby={`${ids}-works`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.works.eyebrow}</p>
            <h2 id={`${ids}-works`} className={styles.sectionTitle} data-motion="title">
              {t.works.title}
            </h2>
          </header>
          <ol className={styles.workList}>
            {t.works.items.map((work, index) => (
              <li key={work.title} className={styles.work}>
                <div className={styles.workVisual} data-motion="unveil">
                  {work.logos && (
                    <ul className={styles.logos}>
                      {work.logos.map((logo) => (
                        <li key={logo.name}>
                          <img
                            src={logo.src}
                            alt={logo.name}
                            width={logo.width}
                            height={logo.height}
                            loading="lazy"
                            decoding="async"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {work.screen && (
                    <BrowserFrame photo={work.screen} sizes="(min-width: 60em) 50vw, 100vw" />
                  )}
                </div>
                <div className={styles.workText}>
                  <p className={styles.workNumber}>{count(index)}</p>
                  <h3 className={styles.workTitle}>{work.title}</h3>
                  <p className={styles.workBody}>{work.text}</p>
                  <p className={styles.workLabel}>{t.works.craftsLabel}</p>
                  <ul className={styles.chips}>
                    {work.crafts.map((craft) => (
                      <li key={craft}>{craft}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- 05 Conviction ---------- */}
      <section className={cx(styles.belief, 'on-dark')} aria-label={t.belief.quote}>
        <div className={styles.beliefGrid}>
          <div className={styles.beliefPhoto} data-motion="unveil">
            <div className={styles.beliefPhotoInner} data-parallax>
              <Photo photo={t.belief.photo} sizes="(min-width: 60em) 50vw, 100vw" />
            </div>
          </div>
          <figure className={styles.beliefQuote}>
            <QuotesIcon size={48} weight="fill" className={styles.beliefMark} aria-hidden />
            <blockquote>
              <p data-motion="words">{t.belief.quote}</p>
            </blockquote>
            <figcaption className={styles.beliefText}>{t.belief.text}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- 06 Notre méthode ---------- */}
      <section className={styles.method} aria-labelledby={`${ids}-method`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.method.eyebrow}</p>
            <h2 id={`${ids}-method`} className={styles.sectionTitle} data-motion="title">
              {t.method.title}
            </h2>
          </header>
          <ol className={styles.steps}>
            {t.method.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {count(index)}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- 07 Pourquoi nous ---------- */}
      <section className={styles.reasons} aria-labelledby={`${ids}-reasons`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.reasons.eyebrow}</p>
            <h2 id={`${ids}-reasons`} className={styles.sectionTitle} data-motion="title">
              {t.reasons.title}
            </h2>
          </header>
          <ul className={styles.reasonList}>
            {t.reasons.items.map((item, index) => {
              const Icon = REASON_ICONS[index];
              return (
                <li key={item.title} className={styles.reason}>
                  <span className={styles.reasonIcon} aria-hidden="true">
                    {Icon && <Icon size={28} weight="duotone" />}
                  </span>
                  <h3 className={styles.reasonTitle}>{item.title}</h3>
                  <p className={styles.reasonText}>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- 08 Questions fréquentes ---------- */}
      <section className={styles.faq} aria-labelledby={`${ids}-faq`}>
        <div className={cx('container', styles.faqGrid)}>
          <header className={styles.faqHead}>
            <p className={styles.eyebrow}>{t.faq.eyebrow}</p>
            <h2 id={`${ids}-faq`} className={styles.sectionTitle} data-motion="title">
              {t.faq.title}
            </h2>
          </header>
          <div className={styles.faqList}>
            {t.faq.items.map((item, index) => (
              <details key={item.question} className={styles.faqItem} open={index === 0}>
                <summary className={styles.faqQuestion}>
                  <span>{item.question}</span>
                  <PlusIcon size={22} className={styles.faqIcon} aria-hidden />
                </summary>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 09 Premier échange ---------- */}
      <ContactBand />
    </div>
  );
}
