import { FootprintsIcon } from '@phosphor-icons/react/dist/csr/Footprints';
import { LockKeyIcon } from '@phosphor-icons/react/dist/csr/LockKey';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { QuotesIcon } from '@phosphor-icons/react/dist/csr/Quotes';
import { ScalesIcon } from '@phosphor-icons/react/dist/csr/Scales';
import { TargetIcon } from '@phosphor-icons/react/dist/csr/Target';
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
import { coachingContent, JOURNEY_ID } from './content';
import styles from './CoachingPage.module.css';

const COMMITMENT_ICONS = [LockKeyIcon, ScalesIcon, TargetIcon, FootprintsIcon];
const count = (index: number) => String(index + 1).padStart(2, '0');

/** Une photo en deux tailles (800 et 1600 px), au format 3:2. */
function Photo({
  photo,
  sizes,
  priority = false,
}: {
  photo: { src: string; small: string; alt: string };
  sizes: string;
  priority?: boolean;
}) {
  return (
    <img
      src={photo.small}
      srcSet={`${photo.small} 800w, ${photo.src} 1600w`}
      sizes={sizes}
      alt={photo.alt}
      width={1600}
      height={1067}
      {...(priority
        ? { fetchPriority: 'high' as const }
        : { loading: 'lazy' as const, decoding: 'async' as const })}
    />
  );
}

/**
 * Page « Coaching professionnel » (/expertises/coaching-professionnel), ouverte par « Découvrir
 * ce domaine » et par le menu. Elle se lit comme un récit, du constat à la prise de contact :
 * 01 Haut de page, bleu 10 % : l'accroche, la promesse, deux boutons, trois repères ; à droite,
 *    une photo de séance jusqu'au bord de l'écran (comme les pages formation).
 * 02 Pourquoi un coach, blanc : une phrase qui s'allume mot à mot au défilement.
 * 03 Vous vous reconnaissez ?, bleu 10 % : cinq paroles de dirigeants et de cadres, chacune
 *    menant à l'accompagnement qui y répond.
 * 04 Nos accompagnements, blanc : les cinq, en alternance photo et texte (pour qui, ce qui
 *    change) ; chacun porte l'ancre de sa sous-rubrique du menu.
 * 05 Conviction, bleu nuit : une grande photo et la phrase qui résume le métier.
 * 06 Le déroulement, blanc : quatre étapes reliées par un fil.
 * 07 Nos engagements, bleu 10 % : quatre engagements et leurs pictogrammes.
 * 08 Questions fréquentes, blanc : questions dépliables.
 * 09 Premier échange (ContactBand).
 * Textes : ./content.ts. Mouvement : celui de « Le cabinet » (titres, photos, mots).
 */
export default function CoachingPage() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const t = coachingContent[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);

  // Arrivée par une sous-rubrique (/…/coaching-de-dirigeants) : la page descend jusqu'à elle.
  useEffect(() => {
    const sub = pathname.split('/')[3];
    const target = sub && document.getElementById(sub);
    if (!target) return;
    const frame = requestAnimationFrame(() => scrollToElement(target));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Un lien vers une ancre de la page : défilement doux, sans changer d'adresse.
  const jump = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
  };

  const titleOf = (id: string) => t.offers.items.find((item) => item.id === id)?.title ?? '';

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
              <a href={`#${JOURNEY_ID}`} className={styles.secondary} onClick={jump(JOURNEY_ID)}>
                {t.hero.secondary}
              </a>
            </div>
            <ul className={styles.pillars}>
              {t.hero.pillars.map((pillar) => (
                <li key={pillar}>{pillar}</li>
              ))}
            </ul>
          </div>
          <div className={styles.heroPhoto} data-motion="unveil">
            <Photo photo={t.hero.photo} sizes="(min-width: 60em) 50vw, 100vw" priority />
          </div>
        </div>
      </section>

      {/* ---------- 02 Pourquoi un coach ---------- */}
      <section className={styles.why} aria-labelledby={`${ids}-why`}>
        <div className={cx('container', styles.whyInner)}>
          <h2 id={`${ids}-why`} className={styles.eyebrow}>
            {t.why.eyebrow}
          </h2>
          <p className={styles.statement} data-motion="words">
            {t.why.statement}
          </p>
        </div>
      </section>

      {/* ---------- 03 Vous vous reconnaissez ? ---------- */}
      <section className={styles.situations} aria-labelledby={`${ids}-situations`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.situations.eyebrow}</p>
            <h2 id={`${ids}-situations`} className={styles.sectionTitle} data-motion="title">
              {t.situations.title}
            </h2>
          </header>
          <ul className={styles.quotes}>
            {t.situations.items.map((item) => (
              <li key={item.offer} className={styles.quoteCard}>
                <QuotesIcon size={30} weight="fill" className={styles.quoteMark} aria-hidden />
                <p className={styles.quoteText}>{item.quote}</p>
                <a href={`#${item.offer}`} className={styles.quoteLink} onClick={jump(item.offer)}>
                  <span className={styles.quoteLinkLabel}>{t.situations.more}</span>
                  <span className={styles.quoteLinkTitle}>
                    {titleOf(item.offer)}
                    <ArrowRightIcon size={16} className="arrow" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 04 Nos accompagnements ---------- */}
      <section className={styles.offers} aria-labelledby={`${ids}-offers`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.offers.eyebrow}</p>
            <h2 id={`${ids}-offers`} className={styles.sectionTitle} data-motion="title">
              {t.offers.title}
            </h2>
          </header>
          <ol className={styles.offerList}>
            {t.offers.items.map((offer, index) => (
              <li key={offer.id} id={offer.id} className={styles.offer}>
                <div className={styles.offerPhoto} data-motion="unveil">
                  <div className={styles.offerPhotoInner} data-parallax>
                    <Photo photo={offer.photo} sizes="(min-width: 60em) 46vw, 100vw" />
                  </div>
                </div>
                <div className={styles.offerText}>
                  <p className={styles.offerNumber}>{count(index)}</p>
                  <h3 className={styles.offerTitle}>{offer.title}</h3>
                  <p className={styles.offerAudience}>
                    <strong>{t.offers.audienceLabel}</strong> {offer.audience}
                  </p>
                  <p className={styles.offerBody}>{offer.text}</p>
                  <p className={styles.gainsLabel}>{t.offers.gainsLabel}</p>
                  <ul className={styles.gains}>
                    {offer.gains.map((gain) => (
                      <li key={gain}>{gain}</li>
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
          </figure>
        </div>
      </section>

      {/* ---------- 06 Le déroulement ---------- */}
      <section id={JOURNEY_ID} className={styles.journey} aria-labelledby={`${ids}-journey`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.journey.eyebrow}</p>
            <h2 id={`${ids}-journey`} className={styles.sectionTitle} data-motion="title">
              {t.journey.title}
            </h2>
          </header>
          <ol className={styles.steps}>
            {t.journey.steps.map((step, index) => (
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

      {/* ---------- 07 Nos engagements ---------- */}
      <section className={styles.commitments} aria-labelledby={`${ids}-commitments`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.commitments.eyebrow}</p>
            <h2 id={`${ids}-commitments`} className={styles.sectionTitle} data-motion="title">
              {t.commitments.title}
            </h2>
          </header>
          <ul className={styles.commitmentList}>
            {t.commitments.items.map((item, index) => {
              const Icon = COMMITMENT_ICONS[index];
              return (
                <li key={item.title} className={styles.commitment}>
                  <span className={styles.commitmentIcon} aria-hidden="true">
                    {Icon && <Icon size={28} weight="duotone" />}
                  </span>
                  <h3 className={styles.commitmentTitle}>{item.title}</h3>
                  <p className={styles.commitmentText}>{item.text}</p>
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
