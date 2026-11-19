import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { QuotesIcon } from '@phosphor-icons/react/dist/csr/Quotes';
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
import { CertBadge } from './CertBadge';
import { CATALOGUE_ID, certificationContent, RIBBON } from './content';
import styles from './CertificationPage.module.css';

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
 * Page « Certification et accréditation » (/expertises/certification-et-accreditation) :
 * 01 Haut de page, bleu 10 % : l'accroche, la promesse, deux boutons ; à droite, une photo
 *    d'inspection jusqu'au bord de l'écran (comme les pages formation et coaching).
 *    Dessous, le bandeau des badges des référentiels, qui défile lentement.
 * 02 Les certifications, bleu 10 % : trois familles (systèmes de management, produits et
 *    services, accréditation) ; pour chacune, une photo et sa présentation, puis ses
 *    référentiels : badge, nom, ce qu'il atteste, pour qui. Chaque famille porte une ancre.
 * 03 Impartialité, bleu nuit : une photo et la phrase qui fonde le métier.
 * 04 Notre démarche, blanc : six étapes, puis la formation ISO 9001:2026.
 * 05 Références, bleu 10 % : les deux missions de « Nos expertises ».
 * 06 Questions fréquentes, blanc ; 07 Premier échange (ContactBand).
 * Textes : ./content.ts. Mouvement : celui de « Le cabinet » (titres, photos, mots).
 */
export default function CertificationPage() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const t = certificationContent[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);

  // Arrivée par une sous-adresse (/…/accreditation) : la page descend jusqu'à la famille.
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

  const names = t.catalogue.families.flatMap((family) => family.items.map((item) => item.name));

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
              <a
                href={`#${CATALOGUE_ID}`}
                className={styles.secondary}
                onClick={jump(CATALOGUE_ID)}
              >
                {t.hero.secondary}
              </a>
            </div>
          </div>
          <div className={styles.heroPhoto} data-motion="unveil">
            <Photo photo={t.hero.photo} sizes="(min-width: 60em) 50vw, 100vw" priority />
          </div>
        </div>
      </section>

      {/* Le bandeau des badges : deux fois la même rangée, pour un défilement sans fin. */}
      <div className={styles.ribbon} role="region" aria-label={t.ribbonLabel}>
        <div className={styles.ribbonTrack}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.ribbonRow} aria-hidden={copy === 1 || undefined}>
              {RIBBON.map((badge, index) => (
                <li key={index} className={styles.ribbonItem}>
                  <CertBadge badge={badge} className={styles.ribbonBadge} />
                  <span>{names[index]}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ---------- 02 Les certifications ---------- */}
      <section id={CATALOGUE_ID} className={styles.catalogue} aria-labelledby={`${ids}-catalogue`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.catalogue.eyebrow}</p>
            <h2 id={`${ids}-catalogue`} className={styles.sectionTitle} data-motion="title">
              {t.catalogue.title}
            </h2>
            <p className={styles.headLead}>{t.catalogue.lead}</p>
          </header>

          <div className={styles.families}>
            {t.catalogue.families.map((family, index) => (
              <article
                key={family.id}
                id={family.id}
                className={styles.family}
                aria-labelledby={`${ids}-family-${index}`}
              >
                <div className={styles.familyIntro}>
                  <div className={styles.familyPhoto} data-motion="unveil">
                    <div className={styles.familyPhotoInner} data-parallax>
                      <Photo photo={family.photo} sizes="(min-width: 64em) 38vw, 100vw" />
                    </div>
                  </div>
                  <p className={styles.familyNumber}>{count(index)}</p>
                  <h3 id={`${ids}-family-${index}`} className={styles.familyTitle}>
                    {family.title}
                  </h3>
                  <p className={styles.familyLead}>{family.lead}</p>
                </div>
                <ul className={styles.certs}>
                  {family.items.map((item) => (
                    <li key={item.name} className={styles.cert}>
                      <CertBadge badge={item.badge} className={styles.certBadge} />
                      <div className={styles.certText}>
                        <h4 className={styles.certName}>{item.name}</h4>
                        <p className={styles.certScope}>{item.scope}</p>
                        <p className={styles.certAudience}>
                          <strong>{t.catalogue.audienceLabel}</strong> {item.audience}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className={styles.note}>{t.catalogue.note}</p>
        </div>
      </section>

      {/* ---------- 03 Impartialité ---------- */}
      <section className={cx(styles.belief, 'on-dark')} aria-label={t.impartiality.quote}>
        <div className={styles.beliefGrid}>
          <div className={styles.beliefPhoto} data-motion="unveil">
            <div className={styles.beliefPhotoInner} data-parallax>
              <Photo photo={t.impartiality.photo} sizes="(min-width: 60em) 50vw, 100vw" />
            </div>
          </div>
          <figure className={styles.beliefQuote}>
            <QuotesIcon size={48} weight="fill" className={styles.beliefMark} aria-hidden />
            <blockquote>
              <p data-motion="words">{t.impartiality.quote}</p>
            </blockquote>
            <figcaption className={styles.beliefText}>{t.impartiality.text}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- 04 Notre démarche ---------- */}
      <section className={styles.path} aria-labelledby={`${ids}-path`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.path.eyebrow}</p>
            <h2 id={`${ids}-path`} className={styles.sectionTitle} data-motion="title">
              {t.path.title}
            </h2>
          </header>
          <ol className={styles.steps}>
            {t.path.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {count(index)}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
          <Link to={t.path.training.href} className={styles.training}>
            <span className={styles.trainingLabel}>{t.path.training.label}</span>
            <span className={styles.trainingTitle}>
              {t.path.training.title}
              <ArrowRightIcon size={18} className="arrow" />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------- 05 Références ---------- */}
      <section className={styles.references} aria-labelledby={`${ids}-references`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.references.eyebrow}</p>
            <h2 id={`${ids}-references`} className={styles.sectionTitle} data-motion="title">
              {t.references.title}
            </h2>
          </header>
          <ul className={styles.referenceList}>
            {t.references.items.map((item) => (
              <li key={item.title} className={styles.reference}>
                <p className={styles.referenceClient}>
                  {item.year ? `${item.client} · ${item.year}` : item.client}
                </p>
                <h3 className={styles.referenceTitle}>{item.title}</h3>
                <p className={styles.referenceText}>{item.text}</p>
                <ul className={styles.norms}>
                  {item.norms.map((norm) => (
                    <li key={norm}>{norm}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 06 Questions fréquentes ---------- */}
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

      {/* ---------- 07 Premier échange ---------- */}
      <ContactBand />
    </div>
  );
}
