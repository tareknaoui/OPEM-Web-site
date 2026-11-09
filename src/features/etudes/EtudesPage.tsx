import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { etudesContent } from './content';
import styles from './EtudesPage.module.css';
import { FamilyArt } from './FamilyArt';
import { PointCloud } from './PointCloud';

/**
 * Page du domaine « Études stratégiques », ouverte par « Découvrir ce domaine » (carte 01 de
 * l'accueil et de « Nos expertises »). Page unique, six blocs à venir ; le type de visuel change
 * d'un bloc à l'autre (deux voisins ne se ressemblent jamais).
 * 01 Ouverture, bleu 10 % : texte à gauche ; à droite, image abstraite (un nuage de points qui
 *    se resserre jusqu'au point ambre, sur panneau bleu nuit) ; dessous sur tablette et téléphone.
 * 02 Votre situation, blanc : la question, puis quatre onglets (un par famille, comme les
 *    sélecteurs de BCG) ; une seule famille affichée à la fois, comme la maquette C1 : un bandeau
 *    bleu nuit (« Famille 01 », titre, phrase d'ouverture ; à droite une image isométrique, voir
 *    FamilyArt), puis « Nos domaines d'intervention » : études numérotées, intitulé puis
 *    description, deux colonnes au-delà de 860 px. Les quatre familles restent dans la page
 *    (moteurs de recherche, lecteurs d'écran). Aucun lien.
 * Un seul titre principal (H1, bloc 01) ; les blocs suivants en H2. Textes : ./content.ts.
 */
export default function EtudesPage() {
  const { lang } = useLanguage();
  const t = etudesContent[lang];
  const ids = useId();
  const { opening, situation } = t;
  // Entre l'intitulé et la description : espace insécable avant les deux-points en français.
  const colon = lang === 'fr' ? ' : ' : ': ';
  const count = (n: number) => String(n).padStart(2, '0');

  // Bloc 02 : la famille affichée. Onglets au clavier : flèches (inversées en arabe), Début, Fin.
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = situation.families.length;
  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = lang === 'ar' ? -1 : 1;
    const moves: Record<string, number> = {
      ArrowRight: (active + step + total) % total,
      ArrowLeft: (active - step + total) % total,
      Home: 0,
      End: total - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={styles.page}>
      <title>{`${t.title} · ${env.appName}`}</title>

      {/* ---------- 01 Ouverture ---------- */}
      <section className={styles.opening} aria-labelledby={`${ids}-opening`}>
        <div className={cx('container', styles.split)}>
          <div className={styles.text}>
            <p className={styles.eyebrow}>{opening.eyebrow}</p>
            <h1 id={`${ids}-opening`} className={styles.title}>
              {opening.title}
            </h1>
            <p className={styles.body}>{opening.text}</p>
          </div>
          <div className={styles.panel}>
            <PointCloud alt={opening.alt} />
          </div>
        </div>
      </section>

      {/* ---------- 02 Votre situation ---------- */}
      <section className={styles.situation} aria-labelledby={`${ids}-situation`}>
        <div className="container">
          <header className={styles.situationHead}>
            <p className={styles.eyebrow}>{situation.eyebrow}</p>
            <h2 id={`${ids}-situation`} className={styles.sectionTitle}>
              {/* Un mot à trait d'union (« souhaitez-vous ») ne se coupe jamais en fin de ligne. */}
              {situation.title.split(/(\S+-\S+)/).map((part, i) =>
                part.includes('-') ? (
                  <span key={i} className={styles.nowrap}>
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
            </h2>
          </header>
          {/* Le choix de l'enjeu : quatre onglets (numéro, titre, nombre d'études). */}
          <div
            className={styles.tabs}
            role="tablist"
            aria-label={situation.title}
            onKeyDown={onTabKey}
          >
            {situation.families.map((family, index) => (
              <button
                key={family.number}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${ids}-tab-${index}`}
                aria-controls={`${ids}-panel-${index}`}
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(index)}
              >
                <span className={styles.tabNumber}>{family.number}</span>
                <span className={styles.tabTitle}>{family.title}</span>
                <span className={styles.tabCount}>
                  {count(family.studies.length)} {situation.labels.studies}
                </span>
              </button>
            ))}
          </div>
          {situation.families.map((family, index) => (
            <div
              key={family.number}
              role="tabpanel"
              id={`${ids}-panel-${index}`}
              aria-labelledby={`${ids}-tab-${index}`}
              hidden={index !== active}
              className={styles.family}
            >
              {/* Le bandeau bleu nuit : surtitre, titre H3, phrase d'ouverture ; l'image à côté. */}
              <div className={styles.familyBanner}>
                <div className={styles.familyText}>
                  <p className={styles.familyNumber}>
                    {situation.labels.family} {family.number}
                  </p>
                  <h3 className={styles.familyTitle}>{family.title}</h3>
                  <p className={styles.familyLead}>{family.lead}</p>
                  <span className={styles.familyRule} aria-hidden="true" />
                </div>
                <div className={styles.familyArt}>
                  {/* Montée à l'ouverture de l'onglet : l'image se rejoue à chaque choix. */}
                  {index === active && <FamilyArt index={index} />}
                </div>
              </div>
              {/* Nos domaines d'intervention : études numérotées, deux colonnes sur ordinateur. */}
              <div className={styles.domains}>
                <div className={styles.domainsHead}>
                  <p className={styles.domainsTitle}>{situation.labels.domains}</p>
                  <p className={styles.domainsCount}>
                    {count(family.studies.length)} {situation.labels.studies}
                  </p>
                </div>
                <ol className={styles.studies}>
                  {family.studies.map((item) => (
                    <li key={item.label} className={styles.study}>
                      <span className={styles.studyLabel}>
                        {item.label}
                        <span className={styles.hidden}>{colon}</span>
                      </span>
                      <span className={styles.studyText}>{item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
