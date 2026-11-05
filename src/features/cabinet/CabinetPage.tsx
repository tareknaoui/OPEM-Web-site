import type { MouseEvent } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { cabinetContent } from './content';
import { History } from './sections/History';
import { useActiveSection } from './useActiveSection';
import styles from './CabinetPage.module.css';

const HERO_PHOTO = '/images/cabinet/equipe';

/**
 * Clic sur une rubrique : la page descend en douceur jusqu'à son titre (d'un coup en
 * mouvement réduit) ; l'adresse prend l'ancre sans créer de navigation (le routeur l'aurait
 * interceptée et laissé la page en place).
 */
function goToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(window.history.state, '', `#${id}`);
}

/**
 * Page « Le cabinet », reconstruite en neuf blocs à ancres (01 Ouverture … 09 Deux portes),
 * ajoutés au fur et à mesure. En tête, façon « About BCG » : une grande photo, la barre des
 * rubriques posée dessus (collée sous le menu au défilement, la rubrique en cours en vert, un
 * clic y descend), le titre et la présentation sur un panneau bleu nuit qui chevauche le bas
 * de la photo (ouverture provisoire, en attendant le bloc 01). Puis 02 Notre histoire.
 * Textes : ./content.ts
 */
export default function CabinetPage() {
  const { lang } = useLanguage();
  const content = cabinetContent[lang];
  const { hero, history } = content;

  // Barre des rubriques : une entrée par bloc déjà construit, vers son titre.
  const toc = [{ id: 'notre-histoire', label: history.eyebrow }];
  const active = useActiveSection(toc.map((entry) => entry.id));

  return (
    <div className={styles.page}>
      <title>{content.title}</title>

      <div className={styles.subnavRail}>
        <div className="container">
          <nav className={styles.subnav} aria-label={hero.toc}>
            <span className={styles.subnavLabel} aria-hidden="true">
              {hero.eyebrow} :
            </span>
            <ol className={styles.subnavList}>
              {toc.map((entry) => (
                <li key={entry.id}>
                  <a
                    className={styles.subnavLink}
                    href={`#${entry.id}`}
                    onClick={(event) => goToSection(event, entry.id)}
                    aria-current={active === entry.id ? 'location' : undefined}
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* ---------- En-tête : grande photo, panneau bleu nuit qui la chevauche ---------- */}
      <section className={styles.hero} aria-labelledby="cabinet-title">
        <div className={styles.photo}>
          <img
            src={`${HERO_PHOTO}.webp`}
            srcSet={`${HERO_PHOTO}-700.webp 700w, ${HERO_PHOTO}-1200.webp 1200w, ${HERO_PHOTO}.webp 2400w`}
            sizes="100vw"
            width={2400}
            height={1350}
            alt=""
            fetchPriority="high"
          />
        </div>
        <div className="container">
          <div className={cx(styles.panel, 'on-dark')}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 id="cabinet-title" className={styles.headline}>
              {hero.headline[0]} <span className={styles.headlineLine}>{hero.headline[1]}</span>
            </h1>
            <p className={styles.intro}>{hero.intro}</p>
          </div>
        </div>
      </section>

      <History history={history} />
    </div>
  );
}
