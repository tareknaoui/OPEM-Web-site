import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { CountUp } from '@/components/ui/CountUp';
import type { HomeContent, StudyIcon } from '../content';
import styles from './StudiesBand.module.css';

type Studies = HomeContent['testimonials']['studies'];

const formatCount = (value: number) => String(Math.round(value));

/**
 * « Études et évaluations », bande bleu nuit sous les témoignages, sur un fond de points façon
 * plan d'architecte. À gauche l'étiquette, le titre, le texte et le bouton blanc (fixes au
 * défilement sur ordinateur) ; à droite, une grande carte « Ministères » (leur nombre, compté dans
 * la liste, puis leurs noms) et trois cartes de partenaires : sigle en grand, nombre de
 * programmes et leurs pastilles, ou texte. Les pictogrammes se tracent à l'apparition, les
 * nombres comptent jusqu'à leur valeur (rien en mouvement réduit). Ambre : étiquette et grands
 * nombres seulement.
 */
export function StudiesBand({ studies }: { studies: Studies }) {
  const { ministries, partners } = studies;

  return (
    <div className={styles.band}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro} data-reveal>
            <p className={styles.eyebrow}>{studies.eyebrow}</p>
            <h3 className={styles.title}>{studies.title}</h3>
            <p className={styles.text}>{studies.text}</p>
            <Link to={studies.cta.href} className={`btn ${styles.cta}`}>
              {studies.cta.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </div>

          <ul className={styles.cards} data-reveal-stagger>
            <li className={`${styles.card} ${styles.ministries}`}>
              <div className={styles.ministriesHead}>
                <Pictogram name="ministry" />
                <p className={styles.figure}>
                  <CountUp
                    className={styles.number}
                    value={ministries.items.length}
                    format={formatCount}
                    durationMs={1200}
                  />
                  <span className={styles.cardTitle}>{ministries.title}</span>
                </p>
              </div>
              <ul className={styles.ministryList}>
                {ministries.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>

            {partners.map((partner, index) => (
              <li key={partner.title} className={styles.card}>
                <Pictogram name={partner.icon} />
                <p className={styles.cardTitle}>{partner.title}</p>
                {partner.highlight && <p className={styles.highlight}>{partner.highlight}</p>}
                {partner.tags && (
                  <>
                    <p className={styles.count}>
                      <CountUp
                        className={styles.number}
                        value={partner.tags.length}
                        format={formatCount}
                        durationMs={1200}
                        delayMs={200 * (index + 1)}
                      />{' '}
                      {partner.countLabel}
                    </p>
                    <ul className={styles.tags}>
                      {partner.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </>
                )}
                {partner.text && <p className={styles.cardText}>{partner.text}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Pictogrammes à trait fin, dans une pastille. Chaque tracé a une longueur normalisée (pathLength)
 * pour se dessiner d'un trait quand la carte apparaît (CSS).
 */
function Pictogram({ name }: { name: StudyIcon | 'ministry' }) {
  return (
    <span className={styles.pictogram}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {SHAPES[name]}
      </svg>
    </span>
  );
}

const SHAPES: Record<StudyIcon | 'ministry', ReactNode> = {
  // Bâtiment à colonnes : fronton, entablement, quatre colonnes, socle.
  ministry: (
    <>
      <path pathLength={1} d="M4 12 16 5l12 7" />
      <path pathLength={1} d="M5 12h22M6 15h20" />
      <path pathLength={1} d="M9 15v9M14 15v9M18 15v9M23 15v9" />
      <path pathLength={1} d="M5 24h22M3.5 27h25" />
    </>
  ),
  // Globe : contour, méridiens, parallèles.
  globe: (
    <>
      <circle pathLength={1} cx="16" cy="16" r="11" />
      <path
        pathLength={1}
        d="M16 5c-3.6 3-5.2 6.8-5.2 11s1.6 8 5.2 11c3.6-3 5.2-6.8 5.2-11S19.6 8 16 5Z"
      />
      <path pathLength={1} d="M5.6 12.5h20.8M5.6 19.5h20.8" />
    </>
  ),
  // Coopération : deux cercles qui se rejoignent, et leur zone commune.
  cooperation: (
    <>
      <circle pathLength={1} cx="12" cy="16" r="7.5" />
      <circle pathLength={1} cx="20" cy="16" r="7.5" />
      <path pathLength={1} d="M16 10.2v11.6" />
    </>
  ),
  // Réseau : un nœud central relié à quatre autres.
  network: (
    <>
      <circle pathLength={1} cx="16" cy="16" r="3" />
      <circle pathLength={1} cx="6.5" cy="8" r="2.2" />
      <circle pathLength={1} cx="25.5" cy="8" r="2.2" />
      <circle pathLength={1} cx="6.5" cy="24" r="2.2" />
      <circle pathLength={1} cx="25.5" cy="24" r="2.2" />
      <path
        pathLength={1}
        d="m8.2 9.4 5.5 4.6M23.8 9.4l-5.5 4.6M8.2 22.6l5.5-4.6M23.8 22.6l-5.5-4.6M8.7 8h14.6"
      />
    </>
  ),
};
