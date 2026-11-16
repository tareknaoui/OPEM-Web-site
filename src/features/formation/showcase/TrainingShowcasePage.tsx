import { ArrowFatLinesUpIcon } from '@phosphor-icons/react/dist/csr/ArrowFatLinesUp';
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowsClockwise';
import { ArrowsSplitIcon } from '@phosphor-icons/react/dist/csr/ArrowsSplit';
import { BinocularsIcon } from '@phosphor-icons/react/dist/csr/Binoculars';
import { BookOpenTextIcon } from '@phosphor-icons/react/dist/csr/BookOpenText';
import { BriefcaseIcon } from '@phosphor-icons/react/dist/csr/Briefcase';
import { BuildingsIcon } from '@phosphor-icons/react/dist/csr/Buildings';
import { CertificateIcon } from '@phosphor-icons/react/dist/csr/Certificate';
import { ChalkboardTeacherIcon } from '@phosphor-icons/react/dist/csr/ChalkboardTeacher';
import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { ClipboardTextIcon } from '@phosphor-icons/react/dist/csr/ClipboardText';
import { ClockIcon } from '@phosphor-icons/react/dist/csr/Clock';
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { CrownIcon } from '@phosphor-icons/react/dist/csr/Crown';
import { ExamIcon } from '@phosphor-icons/react/dist/csr/Exam';
import { FileMagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/FileMagnifyingGlass';
import { FileTextIcon } from '@phosphor-icons/react/dist/csr/FileText';
import { ForkKnifeIcon } from '@phosphor-icons/react/dist/csr/ForkKnife';
import { HouseLineIcon } from '@phosphor-icons/react/dist/csr/HouseLine';
import { IdentificationBadgeIcon } from '@phosphor-icons/react/dist/csr/IdentificationBadge';
import { IntersectThreeIcon } from '@phosphor-icons/react/dist/csr/IntersectThree';
import { LightbulbIcon } from '@phosphor-icons/react/dist/csr/Lightbulb';
import { ListChecksIcon } from '@phosphor-icons/react/dist/csr/ListChecks';
import { ListNumbersIcon } from '@phosphor-icons/react/dist/csr/ListNumbers';
import { LockKeyIcon } from '@phosphor-icons/react/dist/csr/LockKey';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { MapPinIcon } from '@phosphor-icons/react/dist/csr/MapPin';
import { PackageIcon } from '@phosphor-icons/react/dist/csr/Package';
import { PresentationChartIcon } from '@phosphor-icons/react/dist/csr/PresentationChart';
import { ScalesIcon } from '@phosphor-icons/react/dist/csr/Scales';
import { SealCheckIcon } from '@phosphor-icons/react/dist/csr/SealCheck';
import { TargetIcon } from '@phosphor-icons/react/dist/csr/Target';
import { ToolboxIcon } from '@phosphor-icons/react/dist/csr/Toolbox';
import { TreeStructureIcon } from '@phosphor-icons/react/dist/csr/TreeStructure';
import { UserGearIcon } from '@phosphor-icons/react/dist/csr/UserGear';
import { UsersThreeIcon } from '@phosphor-icons/react/dist/csr/UsersThree';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { Link, useParams } from 'react-router';
import { useHideFooterCta } from '@/app/layouts/footer/useHideFooterCta';
import { ArrowRightIcon } from '@/components/icons';
import { useCabinetMotion } from '@/features/cabinet/useCabinetMotion';
import { homeContent } from '@/features/home/content';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { formationContent } from '../content';
import FormationPage from '../FormationPage';
import {
  findShowcase,
  SHOWCASE_CONTACT,
  showcaseLabels,
  type ShowcaseIcon,
  type ShowcaseLabels,
  type TrainingShowcase,
} from './content';
import styles from './TrainingShowcasePage.module.css';

/** Les pictogrammes que le contenu peut choisir (ShowcaseIcon dans content.ts). */
const ICONS: Record<ShowcaseIcon, typeof ClockIcon> = {
  collect: MagnifyingGlassIcon,
  structure: TreeStructureIcon,
  decide: ScalesIcon,
  present: PresentationChartIcon,
  draft: FileMagnifyingGlassIcon,
  toolbox: ToolboxIcon,
  plan: ListChecksIcon,
  compass: CompassIcon,
  meal: ForkKnifeIcon,
  materials: BookOpenTextIcon,
  test: ExamIcon,
  certificate: CertificateIcon,
  leader: CrownIcon,
  quality: SealCheckIcon,
  people: IdentificationBadgeIcon,
  improvement: ArrowsClockwiseIcon,
  manager: UserGearIcon,
  company: BuildingsIcon,
  experience: BriefcaseIcon,
  confidential: LockKeyIcon,
  overlap: IntersectThreeIcon,
  escalate: ArrowFatLinesUpIcon,
  bypass: ArrowsSplitIcon,
  inside: HouseLineIcon,
  outside: BinocularsIcon,
};

const REQUEST_ID = 'demande';
/** Ancres de la barre collée (même ordre que les blocs). */
const SECTIONS = ['pourquoi', 'temps-forts', 'emportez', 'public', 'temoignages'] as const;

/** Une date AAAA-MM-JJ, lue à midi pour éviter tout décalage de fuseau. */
const parse = (date: string) => new Date(`${date}T12:00:00`);

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

/**
 * Les dates d'une session : « 6 au 9 décembre » (le mois une seule fois s'il est le même),
 * puis l'année à part.
 */
function sessionDates(start: string, end: string, locale: string, pattern: string) {
  const from = parse(start);
  const to = parse(end);
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  const dayMonth = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' });
  const dayOnly = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const range = fill(pattern, {
    start: (sameMonth ? dayOnly : dayMonth).format(from),
    end: dayMonth.format(to),
  });
  return `${range} ${to.getFullYear()}`;
}

/** Le courriel de demande, prérempli avec la formation, la session et la référence. */
function requestHref(item: TrainingShowcase, t: ShowcaseLabels, dates: string | null) {
  const values = {
    title: item.title,
    ref: item.reference,
    session: dates ? fill(t.cta.mail.session, { dates }) : '',
  };
  const subject = encodeURIComponent(fill(t.cta.mail.subject, values));
  const body = encodeURIComponent(fill(t.cta.mail.body, values));
  return `mailto:${SHOWCASE_CONTACT.email}?subject=${subject}&body=${body}`;
}

/**
 * Page vitrine d'une formation inter-entreprises (/formation/fiches-formation/<id>), modèle
 * unique : version 10 « catalogue » retenue par OPEM (façon Cegos, ORSYS).
 * Même langage que les autres pages (« Formation qualifiante », « Le cabinet ») :
 * - Ouverture sur bleu très clair : fil d'Ariane, format et ville, titre, sous-titre, accroche,
 *   étiquettes ; à côté, une grande photo arrondie qui se dévoile (léger effet de profondeur).
 * - Deux colonnes sur ordinateur : à droite un encadré « Prochaine session » qui chevauche le bas
 *   de l'ouverture puis reste à l'écran (dates de l'agenda, durée et horaires, effectif, lieu,
 *   référence, demande de fiche technique et de devis) ; à gauche, sous une barre d'ancres
 *   collée sous le menu : Pourquoi cette formation (« Sa singularité » encadrée) ; Quatre temps
 *   forts (cartes à pictogramme ; programme détaillé sur demande) ; Ce que vous emportez
 *   (tuiles) ; Pour qui (étiquettes), Prérequis, La session comprend, l'animation.
 * - Témoignages sur un bandeau bleu nuit pleine largeur, avec trois photos de sessions.
 * - OPEM en chiffres, la demande (encadré bleu OPEM), la mention de protection du contenu.
 * Titres, cartes et tuiles apparaissent au défilement (data-reveal, réglé pour tout le site).
 * Tablette et téléphone : une colonne, l'encadré « session » juste après l'ouverture ; sur
 * téléphone, une barre fixe reprend la demande entre l'encadré et la demande du bas.
 * Le bandeau d'appel du pied de page est masqué : une seule action sur la page.
 * Une formation sans vitrine garde l'ancien comportement (page « Formation qualifiante »,
 * descendue jusqu'à sa session).
 */
export default function TrainingShowcasePage() {
  const { lang } = useLanguage();
  const { id } = useParams();
  const item = findShowcase(lang, id);
  if (!item) return <FormationPage />;
  return <Showcase key={`${lang}-${item.id}`} item={item} />;
}

function Showcase({ item }: { item: TrainingShowcase }) {
  const { lang } = useLanguage();
  const t = showcaseLabels[lang];
  const ids = useId();
  const pageRef = useRef<HTMLDivElement>(null);
  const topActionRef = useRef<HTMLAnchorElement>(null);
  const requestRef = useRef<HTMLElement>(null);
  const [dock, setDock] = useState(false);
  useCabinetMotion(pageRef, lang);
  useHideFooterCta();

  const locale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';
  const session = homeContent[lang].trainings.items.find((s) => s.id === item.id);
  const dates = session ? sessionDates(session.date, session.end, locale, t.range) : null;
  const mailto = requestHref(item, t, dates);
  const { practical } = item;
  const seats = fill(t.facts.seatsValue, { n: practical.seats });
  const [mainVoice, ...otherVoices] = item.voices;
  // Photos réelles de sessions (celles de l'agenda de l'accueil), à côté du témoignage.
  const photos = homeContent[lang].trainings.photos;
  const photosLabel = formationContent[lang].voices.photosLabel;
  const tabLabels = [t.tabs.why, t.tabs.steps, t.tabs.gains, t.tabs.audience, t.tabs.voices];

  // Barre fixe (téléphone) : visible entre les deux demandes, une fois le bouton de l'encadré
  // passé et tant que l'encadré du bas n'est pas arrivé (ni dépassé : pas sur le pied de page).
  useEffect(() => {
    const top = topActionRef.current;
    const request = requestRef.current;
    if (!top || !request || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(() => {
      const pastTop = top.getBoundingClientRect().bottom < 0;
      const beforeRequest = request.getBoundingClientRect().top > window.innerHeight;
      setDock(pastTop && beforeRequest);
    });
    observer.observe(top);
    observer.observe(request);
    return () => observer.disconnect();
  }, []);

  const toSection = (targetId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
  };

  const sectionProps = (index: number) => ({
    id: SECTIONS[index],
    tabIndex: -1,
    'aria-labelledby': `${ids}-${SECTIONS[index]}`,
  });

  return (
    <div ref={pageRef} className={styles.page}>
      <title>{`${item.title} · ${env.appName}`}</title>

      {/* ---------- Ouverture (bleu très clair, comme « Formation qualifiante ») ---------- */}
      <section className={styles.heroBand} aria-labelledby={`${ids}-title`}>
        <div className={cx('container', styles.heroGrid)}>
          <div className={styles.hero}>
            <nav aria-label={t.breadcrumb.label} className={styles.crumbs}>
              <ol>
                <li>
                  <Link to={t.breadcrumb.root.href}>{t.breadcrumb.root.label}</Link>
                </li>
                <li>{item.cycle}</li>
                <li aria-current="page">{item.title}</li>
              </ol>
            </nav>
            <p className={styles.eyebrow}>{fill(t.format, { city: practical.city })}</p>
            <h1 id={`${ids}-title`} className={styles.title} data-motion="title">
              {item.title}
            </h1>
            <p className={styles.subtitle}>{item.subtitle}</p>
            <p className={styles.intro}>{item.intro}</p>
            <ul className={styles.tags} aria-label={t.tags.label} data-reveal-stagger>
              <li>{t.tags.inter}</li>
              <li>{practical.mode}</li>
              <li>{practical.duration}</li>
              <li>{`${seats} ${t.facts.seatsMore}`}</li>
              <li>
                {t.reference} <span dir="ltr">{item.reference}</span>
              </li>
            </ul>
          </div>
          <figure className={styles.photo} data-motion="unveil" data-parallax>
            <img
              src={item.photo.small}
              srcSet={`${item.photo.small} 700w, ${item.photo.large} 1400w`}
              sizes="(min-width: 60em) 42vw, 100vw"
              alt={item.photo.alt}
              width={700}
              height={525}
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      <div className={cx('container', styles.layout)}>
        <div className={styles.col}>
          {/* ---------- Barre d'ancres ---------- */}
          <nav className={styles.tabs} aria-label={t.tabs.label}>
            <ul>
              {SECTIONS.map((section, index) => (
                <li key={section}>
                  <a href={`#${section}`} onClick={toSection(section)}>
                    {tabLabels[index]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- La fiche : une ligne par rubrique, intitulé à gauche, contenu à droite ---------- */}
          <div className={styles.fiche}>
            {/* Pourquoi cette formation */}
            <section className={styles.row} {...sectionProps(0)}>
              <RowHead icon={TargetIcon} id={`${ids}-${SECTIONS[0]}`} label={t.why} />
              <div className={styles.rowBody}>
                <p className={styles.hook}>{item.why.title}</p>
                <ul className={styles.list}>
                  {item.why.symptoms.map((symptom) => {
                    const Icon = ICONS[symptom.icon];
                    return (
                      <li key={symptom.text}>
                        <Icon size={22} weight="duotone" aria-hidden="true" />
                        <span>{symptom.text}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className={styles.answer}>
                  <CheckCircleIcon size={22} weight="fill" aria-hidden="true" />
                  <span>{item.why.answer}</span>
                </p>
                <div className={styles.edge}>
                  <p className={styles.edgeLabel}>
                    <LightbulbIcon size={18} weight="duotone" aria-hidden="true" />
                    {t.edge}
                  </p>
                  <ul className={styles.list}>
                    {item.why.edge.map((part) => {
                      const Icon = ICONS[part.icon];
                      return (
                        <li key={part.label}>
                          <Icon size={22} weight="duotone" aria-hidden="true" />
                          <span>
                            <b>{part.label}</b>
                            {part.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>

            {/* Quatre temps forts */}
            <section className={styles.row} {...sectionProps(1)}>
              <RowHead
                icon={ListNumbersIcon}
                id={`${ids}-${SECTIONS[1]}`}
                label={item.stepsTitle}
              />
              <div className={styles.rowBody}>
                <ol className={styles.steps}>
                  {item.steps.map((step, index) => (
                    <li key={step.title}>
                      <span className={styles.stepNum} aria-hidden="true">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p>{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={styles.note}>
                  <FileTextIcon size={16} aria-hidden="true" />
                  <span>{t.steps.note}</span>
                </p>
              </div>
            </section>

            {/* Ce que vous emportez */}
            <section className={styles.row} {...sectionProps(2)}>
              <RowHead icon={ToolboxIcon} id={`${ids}-${SECTIONS[2]}`} label={t.gains.eyebrow} />
              <div className={styles.rowBody}>
                <p className={styles.rowLead}>{t.gains.title}</p>
                <ul className={styles.list}>
                  {item.gains.map((gain) => {
                    const Icon = ICONS[gain.icon];
                    return (
                      <li key={gain.text}>
                        <Icon size={22} weight="duotone" aria-hidden="true" />
                        <span>{gain.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* Pour qui */}
            <section className={styles.row} {...sectionProps(3)}>
              <RowHead icon={UsersThreeIcon} id={`${ids}-${SECTIONS[3]}`} label={t.audience} />
              <div className={styles.rowBody}>
                <ul className={styles.chips}>
                  {item.audience.roles.map((role) => {
                    const Icon = ICONS[role.icon];
                    return (
                      <li key={role.label}>
                        <Icon size={16} weight="duotone" aria-hidden="true" />
                        {role.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* Prérequis */}
            <section className={styles.row} aria-labelledby={`${ids}-prerequisites`}>
              <RowHead
                icon={ClipboardTextIcon}
                id={`${ids}-prerequisites`}
                label={t.prerequisites}
              />
              <div className={styles.rowBody}>
                <ul className={styles.list}>
                  {item.audience.prerequisites.map((line) => {
                    const Icon = ICONS[line.icon];
                    return (
                      <li key={line.text}>
                        <Icon size={22} weight="duotone" aria-hidden="true" />
                        <span>{line.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* La session comprend */}
            <section className={styles.row} aria-labelledby={`${ids}-includes`}>
              <RowHead icon={PackageIcon} id={`${ids}-includes`} label={t.includes} />
              <div className={styles.rowBody}>
                <ul className={cx(styles.list, styles.listTwo)}>
                  {item.includes.items.map((entry) => {
                    const Icon = ICONS[entry.icon];
                    return (
                      <li key={entry.text}>
                        <Icon size={22} weight="duotone" aria-hidden="true" />
                        <span>{entry.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* Animation */}
            <section className={styles.row} aria-labelledby={`${ids}-trainer`}>
              <RowHead icon={ChalkboardTeacherIcon} id={`${ids}-trainer`} label={t.trainer} />
              <div className={styles.rowBody}>
                <p>{item.includes.trainer}</p>
              </div>
            </section>
          </div>
        </div>

        {/* ---------- Encadré « session » ---------- */}
        <aside className={styles.card} aria-label={t.facts.label}>
          <p className={styles.cardLabel}>{t.card.next}</p>
          <p className={styles.cardDate}>{dates ?? t.facts.noDate}</p>
          <dl className={styles.cardFacts}>
            <div>
              <dt>
                <ClockIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.facts.duration}</span>
              </dt>
              <dd>
                <b>{practical.duration}</b>
                <span>{practical.hours}</span>
              </dd>
            </div>
            <div>
              <dt>
                <UsersThreeIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.facts.seats}</span>
              </dt>
              <dd>
                <b>{seats}</b>
                <span>{t.facts.seatsMore}</span>
              </dd>
            </div>
            <div>
              <dt>
                <MapPinIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.facts.place}</span>
              </dt>
              <dd>
                <b>{practical.place}</b>
                <span>{practical.city}</span>
              </dd>
            </div>
            <div>
              <dt>
                <FileTextIcon size={22} aria-hidden="true" />
                <span className="sr-only">{t.reference}</span>
              </dt>
              <dd>
                <b>
                  {t.reference} <span dir="ltr">{item.reference}</span>
                </b>
                <span>{t.card.refMore}</span>
              </dd>
            </div>
          </dl>
          <a
            ref={topActionRef}
            href={`#${REQUEST_ID}`}
            className={styles.primary}
            onClick={toSection(REQUEST_ID)}
          >
            {t.cta.button}
            <ArrowRightIcon size={18} className="arrow" />
          </a>
          <p className={styles.cardNote}>{t.card.note}</p>
          <p className={styles.cardContact}>
            <a href={SHOWCASE_CONTACT.phone.href} dir="ltr">
              {SHOWCASE_CONTACT.phone.display}
            </a>
            <a href={`mailto:${SHOWCASE_CONTACT.email}`} dir="ltr">
              {SHOWCASE_CONTACT.email}
            </a>
          </p>
        </aside>
      </div>

      {/* ---------- Témoignages : bandeau bleu nuit pleine largeur, avec photos de sessions ---------- */}
      {mainVoice && (
        <section className={cx(styles.voicesBand, 'on-dark')} {...sectionProps(4)}>
          <div className={cx('container', styles.voicesGrid)}>
            <div className={styles.voicesText}>
              <p className={cx(styles.eyebrow, styles.eyebrowDark)}>{t.voices.eyebrow}</p>
              <h2 id={`${ids}-${SECTIONS[4]}`} className={styles.voicesTitle} data-reveal="title">
                {t.voices.title}
              </h2>
              <figure className={styles.voiceMain} data-reveal>
                <span className={styles.qmark} aria-hidden="true">
                  «
                </span>
                <blockquote>
                  <p>{mainVoice.quote}</p>
                </blockquote>
                <figcaption>{mainVoice.author}</figcaption>
              </figure>
            </div>
            <ul className={styles.voicePhotos} aria-label={photosLabel}>
              {photos.map((photo) => (
                <li key={photo.src} className={styles.voicePhoto} data-motion="unveil">
                  <img
                    src={photo.src.replace('.webp', '-700.webp')}
                    alt={photo.alt}
                    width={700}
                    height={525}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>
          {otherVoices.length > 0 && (
            <div className={cx('container', styles.voices)} data-reveal-stagger>
              {otherVoices.map((voice) => (
                <figure key={voice.quote} className={styles.voice}>
                  <blockquote>
                    <p>{voice.quote}</p>
                  </blockquote>
                  <figcaption>{voice.author}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------- OPEM en chiffres ---------- */}
      <section className={styles.figures} aria-labelledby={`${ids}-figures`}>
        <div className="container">
          <h2 id={`${ids}-figures`} className={cx(styles.eyebrow, styles.eyebrowBlue)}>
            {t.figures.eyebrow}
          </h2>
          <dl className={styles.figureList} data-reveal-stagger>
            {t.figures.items.map((figure) => (
              <div key={figure.label} className={styles.figure}>
                <dt>{figure.label}</dt>
                <dd dir="ltr">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Demande de la fiche technique et du devis ---------- */}
      <div className="container">
        <section
          ref={requestRef}
          id={REQUEST_ID}
          className={cx(styles.request, 'on-dark')}
          aria-labelledby={`${ids}-request`}
          tabIndex={-1}
        >
          <div className={styles.requestText}>
            <h2 id={`${ids}-request`} className={styles.requestTitle}>
              {t.cta.title}
            </h2>
            <span className={styles.amberRule} aria-hidden="true" />
            <p>{fill(t.cta.text, { n: practical.seats })}</p>
          </div>
          <div className={styles.requestActions}>
            <a href={mailto} className={styles.light}>
              {t.cta.button}
              <ArrowRightIcon size={18} className="arrow" />
            </a>
            <p className={styles.contact}>
              <span>
                {t.cta.phone}{' '}
                <a href={SHOWCASE_CONTACT.phone.href} dir="ltr">
                  {SHOWCASE_CONTACT.phone.display}
                </a>
              </span>
              <span>
                {t.cta.email}{' '}
                <a href={`mailto:${SHOWCASE_CONTACT.email}`} dir="ltr">
                  {SHOWCASE_CONTACT.email}
                </a>
              </span>
              <span className={styles.reminder}>
                {fill(t.cta.reminder, { ref: '' })}
                <span dir="ltr">{item.reference}</span>
              </span>
            </p>
          </div>
        </section>

        <p className={styles.protection}>
          <span>{t.protection}</span>
          <span>
            {t.reference} <span dir="ltr">{item.reference}</span>
          </span>
        </p>
      </div>

      {/* Barre fixe (téléphone) */}
      <div className={cx(styles.dock, dock && styles.dockShown)} aria-hidden={!dock}>
        <a
          href={`#${REQUEST_ID}`}
          className={styles.primary}
          tabIndex={dock ? 0 : -1}
          onClick={toSection(REQUEST_ID)}
        >
          {t.cta.button}
        </a>
      </div>
    </div>
  );
}

/** Intitulé d'une ligne de la fiche : petit pictogramme, puis le titre de la rubrique. */
function RowHead({ icon: Icon, id, label }: { icon: typeof ClockIcon; id: string; label: string }) {
  return (
    <div className={styles.rowHead}>
      <span className={styles.rowIcon} aria-hidden="true">
        <Icon size={22} weight="duotone" />
      </span>
      <h2 id={id} className={styles.rowTitle}>
        {label}
      </h2>
    </div>
  );
}
