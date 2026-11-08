import { useEffect, useRef, type MouseEvent } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import { useLanguage } from '@/i18n/useLanguage';
import { cabinetContent } from './content';
import { Doors } from './sections/Doors';
import { Guarantees } from './sections/Guarantees';
import { History } from './sections/History';
import { Method } from './sections/Method';
import { Network } from './sections/Network';
import { Pledges } from './sections/Pledges';
import { Regard } from './sections/Regard';
import { Values } from './sections/Values';
import { useActiveSection } from './useActiveSection';
import { useCabinetMotion } from './useCabinetMotion';
import styles from './CabinetPage.module.css';

const HERO_PHOTO = '/images/cabinet/ouverture-session';

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
 * clic y descend), le titre et le texte d'ouverture sur un panneau blanc qui chevauche le bas
 * de la photo (le titre en bleu OPEM puis bleu nuit, d'où le fond clair). Puis 02 Notre histoire et
 * 03 Notre regard, 04 Travailler avec OPEM, 05 Nos valeurs, 06 Nos engagements,
 * 07 Notre réseau d'experts, 08 Nos garanties, 09 Deux portes.
 * Textes : ./content.ts
 */
export default function CabinetPage() {
  const { lang } = useLanguage();
  const content = cabinetContent[lang];
  const { hero, history, regard, method, values, pledges, network, guarantees, doors } = content;

  // Barre des rubriques : une entrée par bloc déjà construit, vers son titre.
  const toc = [
    { id: 'notre-histoire', label: history.eyebrow },
    { id: 'notre-regard', label: regard.eyebrow },
    { id: 'travailler-avec-opem', label: method.eyebrow },
    { id: 'nos-valeurs', label: values.eyebrow },
    { id: 'nos-engagements', label: pledges.eyebrow },
    { id: 'notre-reseau', label: network.eyebrow },
    { id: 'nos-garanties', label: guarantees.eyebrow },
    { id: 'deux-portes', label: doors.eyebrow },
  ];
  const active = useActiveSection(toc.map((entry) => entry.id));

  // Arrivée par un lien à ancre (la FAQ de l'accueil vise #travailler-avec-opem) : la page est
  // chargée à part, le routeur n'a pas trouvé le titre ; on y descend une fois la page en place
  // (après la mise en place de la frise, qui allonge la page).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ block: 'start' }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // La barre des rubriques se range quand on descend et revient quand on remonte.
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const rail = railRef.current;
      const y = window.scrollY;
      if (!rail || Math.abs(y - last) < 6) return;
      if (y > last && y > 320) rail.dataset.hidden = '';
      else delete rail.dataset.hidden;
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Le mouvement de toute la page (titres, photos, mots) ; le contenu est remonté à chaque
  // changement de langue, pour que le découpage du texte reparte d'un texte propre.
  const pageRef = useRef<HTMLDivElement>(null);
  useCabinetMotion(pageRef, lang);

  return (
    <div ref={pageRef} key={lang} className={styles.page}>
      <title>{content.title}</title>

      <div ref={railRef} className={styles.subnavRail}>
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

      {/* ---------- 01 Ouverture : grande photo, panneau blanc qui la chevauche ---------- */}
      <section className={styles.hero} aria-labelledby="cabinet-title">
        <div className={styles.photo} data-parallax>
          <img
            src={`${HERO_PHOTO}.webp`}
            srcSet={`${HERO_PHOTO}-700.webp 700w, ${HERO_PHOTO}-1200.webp 1200w, ${HERO_PHOTO}.webp 2400w`}
            sizes="100vw"
            width={2400}
            height={1310}
            alt={hero.alt}
            fetchPriority="high"
          />
        </div>
        <div className="container">
          <div className={styles.panel}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 id="cabinet-title" className={styles.headline} data-motion="title">
              {hero.headline[0]} <span className={styles.headlineLine}>{hero.headline[1]}</span>
            </h1>
            <p className={styles.intro}>{hero.intro}</p>
          </div>
        </div>
      </section>

      <History history={history} />
      <Regard regard={regard} />
      <Method method={method} />
      <Values values={values} />
      <Pledges pledges={pledges} />
      <Network network={network} />
      <Guarantees guarantees={guarantees} />
      <Doors doors={doors} />
    </div>
  );
}
