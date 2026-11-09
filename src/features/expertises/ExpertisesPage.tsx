import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { GraduationCapIcon } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { MegaphoneIcon } from '@phosphor-icons/react/dist/csr/Megaphone';
import { SealCheckIcon } from '@phosphor-icons/react/dist/csr/SealCheck';
import { StrategyIcon } from '@phosphor-icons/react/dist/csr/Strategy';
import { TreeStructureIcon } from '@phosphor-icons/react/dist/csr/TreeStructure';
import { useId, useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import { Link } from 'react-router';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { ArrowRightIcon } from '@/components/icons';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { DOMAIN_IDS, expertisesContent } from './content';
import styles from './ExpertisesPage.module.css';
import { IssueCompass } from './IssueCompass';
import { Relay } from './Relay';
import { ThreadArt } from './ThreadArt';
import { VerdictBench } from './VerdictBench';

/** Une icône au trait par enjeu (décision, transformation, compétences, prise de poste,
 *  certification, savoir-faire), dans l'ordre des domaines. */
const ISSUE_ICONS = [
  StrategyIcon,
  TreeStructureIcon,
  GraduationCapIcon,
  CompassIcon,
  SealCheckIcon,
  MegaphoneIcon,
];

/**
 * Page « Nos expertises » (/nos-expertises), page unique à ancres, en cinq blocs dont le type de
 * visuel change à chaque fois (deux voisins ne se ressemblent jamais) :
 * 01 Ouverture, bleu 10 % : typographie, les six enjeux en grand index avec chacun son icône
 *    au trait ; chaque enjeu descend en douceur vers sa carte du bloc 02. À droite (ordinateur),
 *    les six métiers en cercle : au survol d'un enjeu, son métier s'allume (IssueCompass).
 * 02 Six domaines, blanc : une rangée par domaine, sa grande photo (autres que les illustrations
 *    de l'accueil) d'un côté puis de l'autre ; la typologie en étiquettes.
 * 03 Les métiers se relaient, bleu 10 % : vraies photos, les quatre métiers d'un même client
 *    se passent le témoin dans un cadre (section figée sur ordinateur), fil du relais dessous.
 * 04 IA appliquée, blanc : le banc d'essai animé, trois usages passent l'examen et reçoivent
 *    leur verdict (icônes sur panneau bleu nuit).
 * 05 Parlons de votre besoin, bleu 10 % : un tracé au trait, juste avant le pied de page.
 * Un seul titre principal (H1, bloc 01) ; les autres blocs en H2. Textes : ./content.ts.
 */
export default function ExpertisesPage() {
  const { lang } = useLanguage();
  const t = expertisesContent[lang];
  const ids = useId();
  const { opening, domains, together, ai, talk } = t;
  const togetherRef = useRef<HTMLElement>(null);
  // L'enjeu survolé (ou atteint au clavier) : son métier s'allume dans l'illustration.
  const [active, setActive] = useState<number | null>(null);
  const leaveIssues = (event: FocusEvent<HTMLOListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
  };

  // Un enjeu mène à la carte de son domaine, en douceur, le menu restant visible à l'arrivée.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
    target.dataset.arrived = '';
    window.setTimeout(() => delete target.dataset.arrived, 1800);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className={styles.page}>
      <title>{t.pageTitle}</title>

      {/* ---------- 01 Ouverture ---------- */}
      <section className={styles.opening} aria-labelledby={`${ids}-opening`}>
        <div className={cx('container', styles.openingInner)}>
          <div className={styles.openingHead}>
            <p className={styles.eyebrow}>{opening.eyebrow}</p>
            {/* Le titre principal (H1) est la première phrase seule ; la seconde la prolonge à
              l'écran, du même corps, sans faire partie du titre. */}
            <h1 id={`${ids}-opening`} className={styles.openingTitle}>
              {opening.title[0]}
            </h1>
            <p className={cx(styles.openingTitle, styles.openingTitleEnd)}>{opening.title[1]}</p>
          </div>
          <div className={styles.openingList}>
            <ol className={styles.issues} onMouseLeave={() => setActive(null)} onBlur={leaveIssues}>
              {opening.issues.map((issue, index) => {
                const id = DOMAIN_IDS[index] ?? '';
                const Icon = ISSUE_ICONS[index];
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={styles.issue}
                      onClick={(event) => goTo(event, id)}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                    >
                      <span className={styles.issueNumber} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.issueIcon} aria-hidden="true">
                        {Icon && <Icon size={24} weight="duotone" />}
                      </span>
                      <span className={styles.issueText}>{issue}</span>
                      <ArrowRightIcon size={20} className={cx('arrow', styles.issueArrow)} />
                    </a>
                  </li>
                );
              })}
            </ol>
            <p className={styles.closing}>{opening.closing}</p>
          </div>
          <div className={styles.openingArt}>
            <IssueCompass
              items={domains.items.map((domain, index) => ({
                title: domain.title,
                lead: (domain.typology.strong[0] ?? '').replace(/\.$/, ''),
                Icon: ISSUE_ICONS[index],
              }))}
              active={active}
              idle={domains.title}
            />
          </div>
        </div>
      </section>

      {/* ---------- 02 Six domaines ---------- */}
      <section className={styles.domains} aria-labelledby={`${ids}-domains`}>
        <div className="container">
          <header className={styles.head} data-reveal>
            <p className={styles.eyebrow}>{domains.eyebrow}</p>
            <h2 id={`${ids}-domains`} className={styles.title}>
              {domains.title}
            </h2>
            <p className={styles.lead}>{domains.lead}</p>
          </header>
          <ol className={styles.cards}>
            {domains.items.map((domain, index) => (
              <li
                key={domain.id}
                id={domain.id}
                className={styles.card}
                tabIndex={-1}
                aria-labelledby={`${ids}-${domain.id}`}
              >
                <div className={styles.cardArt}>
                  <img
                    src={`${domain.photo.src}-800.webp`}
                    srcSet={`${domain.photo.src}-800.webp 800w, ${domain.photo.src}.webp 1376w`}
                    sizes="(min-width: 64em) 46vw, 92vw"
                    width={800}
                    height={600}
                    alt={domain.photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 id={`${ids}-${domain.id}`} className={styles.cardTitle}>
                    {domain.title}
                  </h3>
                  <p className={styles.cardText}>{domain.text}</p>
                  {/* La typologie en étiquettes : les deux premières en relief. */}
                  <ul className={styles.tags}>
                    {[
                      ...domain.typology.strong.map((item) => ({ item, strong: true })),
                      ...domain.typology.rest.map((item) => ({ item, strong: false })),
                    ].map(({ item, strong }) => (
                      <li key={item} className={strong ? styles.tagStrong : styles.tag}>
                        {strong ? (
                          <strong>{item.replace(/\.$/, '')}</strong>
                        ) : (
                          item.replace(/\.$/, '')
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.reference}>{domain.reference}</p>
                  <Link to={domain.link.href} className={styles.cardLink}>
                    {domain.link.label}
                    <ArrowRightIcon size={18} className="arrow" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- 03 Les expertises à l'œuvre ensemble ---------- */}
      <section ref={togetherRef} className={styles.together} aria-labelledby={`${ids}-together`}>
        <div className={cx('container', styles.split)}>
          <div className={styles.splitText} data-reveal>
            <p className={styles.eyebrow}>{together.eyebrow}</p>
            <h2 id={`${ids}-together`} className={styles.title}>
              {together.title}
            </h2>
            <dl className={styles.figures}>
              {together.figures.map((figure) => (
                <div key={figure.label} className={styles.figure}>
                  <dt className={styles.figureValue} data-count={figure.value}>
                    {figure.value}
                  </dt>
                  <dd className={styles.figureLabel}>{figure.label}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.body}>{together.text}</p>
          </div>
          <Relay
            lanes={together.lanes}
            alt={together.alt}
            rtl={lang === 'ar'}
            sectionRef={togetherRef}
          />
        </div>
      </section>

      {/* ---------- 04 IA appliquée ---------- */}
      <section className={styles.ai} aria-labelledby={`${ids}-ai`}>
        <div className={cx('container', styles.split)}>
          <div className={styles.splitText} data-reveal>
            <p className={styles.eyebrow}>{ai.eyebrow}</p>
            <h2 id={`${ids}-ai`} className={styles.title}>
              {ai.title}
            </h2>
            <p className={styles.body}>{ai.text}</p>
            <Link
              to={ai.link.href}
              className={cx('btn', 'btn-secondary', styles.aiLink)}
              aria-label={ai.link.ariaLabel}
            >
              {ai.link.label}
              <ArrowRightIcon size={18} className={cx('arrow', styles.greenArrow)} />
            </Link>
          </div>
          <VerdictBench verdicts={ai.verdicts} alt={ai.alt} rtl={lang === 'ar'} />
        </div>
      </section>

      {/* ---------- 05 Parlons de votre besoin ---------- */}
      <section className={styles.talk} aria-labelledby={`${ids}-talk`}>
        <div className={cx('container', styles.split)}>
          <div className={styles.splitText} data-reveal>
            <p className={styles.eyebrow}>{talk.eyebrow}</p>
            <h2 id={`${ids}-talk`} className={styles.title}>
              <span className={styles.titleLine}>{talk.title[0]}</span>{' '}
              <span className={styles.titleLine}>{talk.title[1]}</span>
            </h2>
            <p className={styles.body}>{talk.text}</p>
            <Link to={QUOTE_HREF} className={cx('btn', 'btn-primary', styles.talkButton)}>
              {talk.button}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
            <p className={styles.note}>{talk.note}</p>
          </div>
          <ThreadArt marks={talk.marks} alt={talk.alt} />
        </div>
      </section>
    </div>
  );
}
