import { useEffect, useId, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { cabinetContent } from '@/features/cabinet/content';
import { STEP_ICONS } from '@/features/cabinet/icons';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { ContactBand } from '@/features/contact/ContactBand';
import { expertisesContent } from '@/features/expertises/content';
import { missionsContent } from '@/features/missions/content';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { DOMAIN_PAGES, DOMAIN_PHOTOS, domainLabels, type DomainPageId } from './content';
import styles from './DomainPage.module.css';

/** Missions présentées au pied de la page, au plus. */
const MAX_CASES = 3;

/** « analyses économiques. » → « Analyses économiques » (les prestations, en liste). */
const asItem = (text: string) => {
  const clean = text.trim().replace(/\.$/, '');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

/** Ancre d'une prestation : « Diagnostic d'entreprise » → « diagnostic-d-entreprise ». */
const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** L'accroche (la première phrase) et la suite du texte d'un domaine. */
const splitText = (text: string): [string, string] => {
  const at = text.indexOf('. ');
  return at < 0 ? [text, ''] : [text.slice(0, at + 1), text.slice(at + 2)];
};

/**
 * Page d'un domaine d'expertise (/expertises/<domaine>) : accompagnement des organisations,
 * coaching professionnel, communication institutionnelle, certification et accréditation.
 * Simple et engageante, sur le modèle de la page Formation :
 * 01 En-tête, bleu 10 % : le domaine, son accroche en titre, sa présentation, deux actions ;
 *    à côté, une grande photo.
 * 02 Nos prestations, blanc : la liste numérotée des prestations (les deux premières en
 *    vedette), puis une grande photo.
 * 03 Notre démarche, bleu 10 % : les quatre temps de « Le cabinet ».
 * 04 Références, blanc : la référence du domaine en grand, puis ses missions (celles de
 *    « Missions et réalisations ») ; sans mission (coaching), l'engagement seul.
 * 05 Premier échange, bleu 10 % : le bouton de rendez-vous, le téléphone et le courriel.
 * Une sous-rubrique du menu (/…/diagnostic-d-entreprise) mène à sa prestation.
 */
export default function DomainPage() {
  const { domain = '' } = useParams();
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);

  const known = (DOMAIN_PAGES as readonly string[]).includes(domain);
  const id = domain as DomainPageId;
  const data = expertisesContent[lang].domains.items.find((item) => item.id === id);

  // Arrivée par une sous-rubrique : la page descend jusqu'à la prestation.
  useEffect(() => {
    const sub = pathname.split('/')[3];
    const target = sub && document.getElementById(sub);
    if (!target) return;
    const frame = requestAnimationFrame(() => scrollToElement(target));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  if (!known || !data) return <NotFoundPage />;

  const t = domainLabels[lang];
  const photos = DOMAIN_PHOTOS[id];
  const method = cabinetContent[lang].method;
  const [tagline, rest] = splitText(data.text);
  const services = [...data.typology.strong, ...data.typology.rest].map(asItem);
  // Ancres en français (mêmes adresses dans les deux langues).
  const frTypology = expertisesContent.fr.domains.items.find((item) => item.id === id)?.typology;
  const anchors = frTypology
    ? [...frTypology.strong, ...frTypology.rest].map((text) => slug(asItem(text)))
    : [];
  const cases = missionsContent[lang].cases.items
    // Une photo déjà montrée en en-tête n'est pas répétée au pied de la page.
    .filter((item) => item.domains.includes(id) && item.image.small !== photos.hero.small)
    .slice(0, MAX_CASES);

  return (
    <div ref={pageRef} key={`${lang}-${id}`} className={styles.page}>
      <title>{`${data.title} · ${env.appName}`}</title>

      {/* ---------- 01 En-tête ---------- */}
      <section className={styles.header} aria-labelledby={`${ids}-title`}>
        <div className={cx('container', styles.headerGrid)}>
          <div className={styles.headerText}>
            <p className={styles.trail}>
              <Link to={t.breadcrumb.href}>{t.breadcrumb.label}</Link>
              <span aria-hidden="true">/</span>
              <span>{data.title}</span>
            </p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {tagline}
            </h1>
            {rest && <p className={styles.lead}>{rest}</p>}
            <div className={styles.actions}>
              <Link to={QUOTE_HREF} className={styles.primary}>
                {t.contact.label}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
              {cases.length > 0 && (
                <Link to={t.cases.href} className={styles.secondary}>
                  {t.cases.label}
                </Link>
              )}
            </div>
          </div>
          <div className={styles.heroPhoto} data-motion="unveil">
            <img
              src={photos.hero.small}
              srcSet={
                photos.hero.large
                  ? `${photos.hero.small} 700w, ${photos.hero.large} 1400w`
                  : undefined
              }
              sizes={photos.hero.large ? '(min-width: 64em) 45vw, 92vw' : undefined}
              alt={photos.hero.alt[lang]}
              width={photos.hero.width}
              height={photos.hero.height}
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* ---------- 02 Nos prestations ---------- */}
      <section className={styles.services} aria-labelledby={`${ids}-services`}>
        <div className={cx('container', styles.servicesGrid)}>
          <header className={styles.servicesHead}>
            <p className={styles.eyebrow}>{t.services.eyebrow}</p>
            <h2 id={`${ids}-services`} className={styles.sectionTitle} data-motion="title">
              {t.services.title}
            </h2>
          </header>
          <ol className={styles.serviceList}>
            {services.map((service, index) => (
              <li
                key={service}
                id={anchors[index]}
                className={cx(
                  styles.service,
                  index < data.typology.strong.length && styles.serviceLead,
                )}
              >
                <span className={styles.serviceNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.serviceName}>{service}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="container">
          <div className={styles.widePhoto} data-motion="unveil">
            <div className={styles.widePhotoInner} data-parallax>
              <img
                src={photos.wide.small}
                srcSet={
                  photos.wide.large
                    ? `${photos.wide.small} 700w, ${photos.wide.large} 2000w`
                    : undefined
                }
                sizes={photos.wide.large ? '92vw' : undefined}
                alt={photos.wide.alt[lang]}
                width={photos.wide.width}
                height={photos.wide.height}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 03 Notre démarche ---------- */}
      <section className={styles.method} aria-labelledby={`${ids}-method`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.method.eyebrow}</p>
            <h2 id={`${ids}-method`} className={styles.sectionTitle} data-motion="title">
              {method.title}
            </h2>
          </header>
          <ol className={styles.steps}>
            {method.steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <li key={step.verb} className={styles.step}>
                  <span className={styles.stepIcon} aria-hidden="true">
                    {Icon && <Icon size={26} weight="duotone" />}
                  </span>
                  <h3 className={styles.stepVerb}>
                    <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                    {step.verb}
                  </h3>
                  <p className={styles.stepText}>{step.text}</p>
                  <p className={styles.stepPromise}>
                    <strong>{method.promiseLabel}</strong> {step.promise}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- 04 Références ---------- */}
      <section className={styles.references} aria-labelledby={`${ids}-references`}>
        <div className="container">
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.references.eyebrow}</p>
            <h2 id={`${ids}-references`} className={styles.sectionTitle} data-motion="title">
              {cases.length > 0 ? t.references.title : data.title}
            </h2>
          </header>
          <blockquote className={styles.reference}>
            <p>{data.reference}</p>
          </blockquote>

          {cases.length > 0 && (
            <>
              <ul className={styles.cases}>
                {cases.map((item) => (
                  <li key={item.id} className={styles.case}>
                    <div className={styles.casePhoto}>
                      <img
                        src={item.image.small}
                        alt={item.image.alt}
                        width={700}
                        height={525}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className={styles.caseTitle}>{item.title}</h3>
                    <p className={styles.caseClient}>
                      {item.year ? `${item.client}, ${item.year}` : item.client}
                    </p>
                  </li>
                ))}
              </ul>
              <Link to={t.cases.href} className={styles.allCases}>
                {t.references.all}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ---------- 05 Premier échange ---------- */}
      <ContactBand />
    </div>
  );
}
