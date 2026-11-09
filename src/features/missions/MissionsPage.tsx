import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { DOMAIN_IDS, expertisesContent } from '@/features/expertises/content';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { env } from '@/lib/env';
import { missionsContent, type ClientKind, type DomainId } from './content';
import styles from './MissionsPage.module.css';

const KINDS: ClientKind[] = ['public', 'prive', 'international'];
/** Cartes affichées d'emblée, puis à chaque « Afficher plus ». */
const PAGE = 6;
/** Ancre de la liste (cible de la rubrique « Études de cas autorisées » du menu). */
const LIST_ID = 'etudes-de-cas';

/**
 * Page « Missions et réalisations » (/missions), aussi simple que les « case studies » de
 * McKinsey : un en-tête (surtitre, titre, une phrase), une barre de filtres (domaine, type de
 * client, nombre de résultats, réinitialiser), puis la grille des études de cas : une carte par
 * mission (photo, domaines, titre, résumé, client), six d'abord, puis « Afficher plus ».
 * Contenu provisoire : ./content.ts.
 */
export default function MissionsPage() {
  const { lang } = useLanguage();
  const t = missionsContent[lang];
  const domainTitles = new Map(
    expertisesContent[lang].domains.items.map((domain) => [domain.id, domain.title]),
  );
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);
  const { pathname } = useLocation();

  const items = t.cases.items;
  const [domain, setDomain] = useState<DomainId | ''>('');
  const [kind, setKind] = useState<ClientKind | ''>('');
  const [visible, setVisible] = useState(PAGE);
  // Seulement les domaines et les types de client présents dans les missions.
  const domains = DOMAIN_IDS.filter((id) => items.some((c) => c.domains.includes(id)));
  const kinds = KINDS.filter((k) => items.some((c) => c.kind === k));
  const matches = items.filter(
    (c) => (!domain || c.domains.includes(domain)) && (!kind || c.kind === kind),
  );
  const shown = matches.slice(0, visible);
  const reset = () => {
    setDomain('');
    setKind('');
    setVisible(PAGE);
  };

  // Arrivée par « Études de cas autorisées » (menu) : la page descend jusqu'à la liste.
  useEffect(() => {
    if (!pathname.startsWith('/missions/etudes-de-cas')) return;
    const target = document.getElementById(LIST_ID);
    if (!target) return;
    const frame = requestAnimationFrame(() => scrollToElement(target));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div ref={pageRef} key={lang} className={styles.page}>
      <title>{`${t.title} · ${env.appName}`}</title>

      <section className={styles.section} aria-labelledby={`${ids}-title`}>
        <div className="container">
          <header className={styles.header}>
            <p className={styles.eyebrow}>{t.header.eyebrow}</p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {t.header.title}
            </h1>
            <p className={styles.lead}>{t.header.lead}</p>
          </header>

          {/* La barre des filtres : deux listes, le nombre de résultats, la réinitialisation. */}
          <div
            id={LIST_ID}
            className={styles.filterBar}
            role="group"
            aria-label={t.cases.filters.label}
          >
            <label className={styles.select}>
              <span className={styles.selectLabel}>{t.cases.filters.domain}</span>
              <select
                value={domain}
                onChange={(event) => {
                  setDomain(event.target.value as DomainId | '');
                  setVisible(PAGE);
                }}
              >
                <option value="">{t.cases.filters.allDomains}</option>
                {domains.map((id) => (
                  <option key={id} value={id}>
                    {domainTitles.get(id)}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.select}>
              <span className={styles.selectLabel}>{t.cases.filters.kind}</span>
              <select
                value={kind}
                onChange={(event) => {
                  setKind(event.target.value as ClientKind | '');
                  setVisible(PAGE);
                }}
              >
                <option value="">{t.cases.filters.allKinds}</option>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {t.cases.filters.kinds[k]}
                  </option>
                ))}
              </select>
            </label>
            <p className={styles.count} aria-live="polite">
              {t.cases.filters.count(matches.length)}
            </p>
            {(domain || kind) && (
              <button type="button" className={styles.reset} onClick={reset}>
                {t.cases.filters.reset}
              </button>
            )}
          </div>

          {shown.length > 0 ? (
            <ul className={styles.grid}>
              {shown.map((item) => (
                <li key={item.id} className={styles.card}>
                  <div className={styles.photo}>
                    <img
                      src={item.image.small}
                      srcSet={
                        item.image.large
                          ? `${item.image.small} 700w, ${item.image.large} 1400w`
                          : undefined
                      }
                      sizes="(min-width: 64em) 30vw, (min-width: 40em) 46vw, 92vw"
                      alt={item.image.alt}
                      width={700}
                      height={525}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className={styles.cardEyebrow}>
                    {item.domains.map((id) => domainTitles.get(id)).join(' · ')}
                  </p>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p className={styles.cardText}>{item.text}</p>
                  <p className={styles.cardClient}>
                    {item.year ? `${item.client}, ${item.year}` : item.client}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{t.cases.empty}</p>
          )}

          {matches.length > visible && (
            <div className={styles.moreRow}>
              <button
                type="button"
                className={styles.more}
                onClick={() => setVisible((n) => n + PAGE)}
              >
                {t.cases.more}
              </button>
            </div>
          )}
          <p className={styles.note}>{t.cases.note}</p>
        </div>
      </section>
    </div>
  );
}
