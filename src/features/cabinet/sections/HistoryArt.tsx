import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { CpuIcon } from '@phosphor-icons/react/dist/csr/Cpu';
import { GraduationCapIcon } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { MegaphoneIcon } from '@phosphor-icons/react/dist/csr/Megaphone';
import { SealCheckIcon } from '@phosphor-icons/react/dist/csr/SealCheck';
import { StrategyIcon } from '@phosphor-icons/react/dist/csr/Strategy';
import { TreeStructureIcon } from '@phosphor-icons/react/dist/csr/TreeStructure';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import type { CabinetContent } from '../content';
import { fitToScreen } from '../useCabinetMotion';
import styles from './History.module.css';

/*
 * « Notre histoire » en trois temps, sur un tableau des domaines :
 * - 2019 : les cinq domaines d'origine apparaissent un à un, chacun avec son icône (celles de
 *   « Nos expertises ») et son nom, qui s'écrit ;
 * - 2025 : à la place libre (en pointillé), le sixième domaine surgit, en vert le temps de son
 *   arrivée ; en 2026, il reprend les couleurs des autres ;
 * - 2026 : l'intelligence artificielle fait son apparition, comme un outil : une bande de
 *   lumière balaie le tableau et pose un badge « IA » (une puce) sur chacun des six domaines.
 *   Aucun domaine ne change de place ni de taille ; l'IA n'a ni case ni centre.
 * Dessous, une frise droite et ferme : 2019, 2025, 2026, puis la suite en pointillé.
 * Pas d'ambre (fond blanc), pas de dégradé.
 */

/** Icônes des six domaines, dans l'ordre de « Nos expertises » (mêmes icônes que cette page). */
const DOMAIN_ICONS = [
  StrategyIcon,
  TreeStructureIcon,
  GraduationCapIcon,
  CompassIcon,
  SealCheckIcon,
  MegaphoneIcon,
];
/** Places des repères sur la frise (en % de sa longueur) : 2019, 2025, 2026. */
const MARKS = [0, 72, 90];

/** Un acte du texte : *mot* en bleu, [[mot]] en vert (le vert du sixième domaine). */
function Act({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*|\[\[[^\]]+\]\])/).map((part, i) => {
    if (part.startsWith('*')) {
      return (
        <strong key={i} className={styles.keyBlue}>
          {part.slice(1, -1)}
        </strong>
      );
    }
    if (part.startsWith('[[')) {
      return (
        <strong key={i} className={styles.keyGreen}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Le compteur d'années : un rouleau de chiffres par position (0 à 9). */
function YearRoller({ years }: { years: string[] }) {
  const first = years[0] ?? '';
  return (
    <div className={styles.roller} aria-hidden="true">
      {first.split('').map((digit, position) => (
        <span key={position} className={styles.rollerWindow}>
          <span
            className={styles.rollerStrip}
            data-roll={position}
            style={{ transform: `translateY(${-Number(digit) * 10}%)` }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Le récit : à gauche le compteur d'années, la légende du repère et le texte en trois actes ; à
 * droite le tableau des domaines. Ordinateur : le récit reste figé à l'écran et se construit au
 * défilement (GSAP ScrollTrigger, réduit au besoin pour tenir). Tablette et téléphone : le texte,
 * puis le tableau, qui se joue de lui-même quand il arrive à l'écran. Sans script ou en
 * mouvement réduit : l'état final, immobile.
 */
export function HistoryArt({
  text,
  milestones,
  domains,
  aiTag,
  rtl,
  alt,
}: {
  text: CabinetContent['history']['text'];
  milestones: CabinetContent['history']['milestones'];
  domains: CabinetContent['history']['domains'];
  aiTag: string;
  rtl: boolean;
  alt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const years = milestones.map((m) => m.year).join(' ');
  const added = domains.length - 1;

  useEffect(() => {
    const story = ref.current;
    const board = story?.querySelector<HTMLElement>('[data-board] > div');
    if (!story || !board || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const all = (attr: string) => gsap.utils.toArray<HTMLElement>(`[${attr}]`, story);
    const acts = all('data-act');
    const captions = all('data-caption');
    const strips = all('data-roll');
    const slots = all('data-slot');
    const cards = all('data-card');
    const names = all('data-name');
    const badges = all('data-badge');
    const marks = all('data-mark');
    const fill = story.querySelector('[data-fill]');
    const ahead = story.querySelector('[data-ahead]');
    const scan = story.querySelector<HTMLElement>('[data-scan]');
    const hole = story.querySelector('[data-hole]');
    // Le sixième domaine : son cadre vert, sa pastille et son année, qui passent au vert en 2025
    // puis reviennent aux couleurs des autres en 2026.
    const frame = story.querySelector('[data-frame]');
    const newCard = cards[cards.length - 1];
    const newIcon = newCard?.querySelector('[data-icon]') ?? null;
    const newYear = newCard?.querySelector('[data-year]') ?? null;
    const token = (name: string) => getComputedStyle(story).getPropertyValue(name).trim();
    const blue = {
      icon: { backgroundColor: token('--opem-blue-10'), color: token('--opem-blue') },
      year: { color: '#5b6770' },
    };
    const green = {
      icon: { backgroundColor: '#e3f1dd', color: token('--opem-green-dark') },
      year: { color: token('--opem-green-dark') },
    };
    const list = years.split(' ');
    const dir = rtl ? -1 : 1;
    // Le nom s'écrit dans le sens de la lecture.
    const hidden = rtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
    /** Largeur de chaque chiffre (0 à 9) de chaque bande, pour ajuster sa fenêtre. */
    const widths = strips.map((strip) =>
      Array.from(strip.children, (digit) => digit.getBoundingClientRect().width),
    );

    /** Le compteur passe à l'année du repère : chaque chiffre roule jusqu'au sien. */
    const roll = (timeline: gsap.core.Timeline, index: number, position: number | string) => {
      const year = list[index] ?? '';
      strips.forEach((strip, i) => {
        const digit = Number(year[i] ?? 0);
        timeline.to(
          strip,
          { yPercent: -digit * 10, duration: 1.4, ease: 'power2.inOut' },
          position,
        );
        timeline.to(
          strip.parentElement,
          { width: widths[i]?.[digit] ?? 'auto', duration: 1.4, ease: 'power2.inOut' },
          position,
        );
      });
    };
    /** Le repère courant : sa légende s'affiche, son acte s'allume, les autres s'estompent. */
    const focus = (timeline: gsap.core.Timeline, index: number, position: number | string) => {
      captions.forEach((caption, i) =>
        timeline.to(
          caption,
          {
            autoAlpha: i === index ? 1 : 0,
            y: i === index ? 0 : i < index ? -12 : 12,
            duration: 0.6,
          },
          position,
        ),
      );
      acts.forEach((act, i) =>
        timeline.to(
          act,
          { opacity: i === index ? 1 : i < index ? 0.45 : 0.22, duration: 0.6 },
          position,
        ),
      );
    };
    /** Un domaine apparaît, puis son nom s'écrit. */
    const reveal = (
      timeline: gsap.core.Timeline,
      index: number,
      position: number | string,
      pop = false,
    ) => {
      const card = cards[index];
      const name = names[index];
      if (!card || !name) return;
      timeline.from(
        card,
        pop
          ? { opacity: 0, scale: 0.4, duration: 0.9, ease: 'back.out(1.8)' }
          : { opacity: 0, y: 26, scale: 0.94, duration: 0.7, ease: 'power3.out' },
        position,
      );
      timeline.fromTo(
        name,
        { clipPath: hidden },
        { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power2.inOut' },
        '<+=0.3',
      );
    };

    /**
     * Le tableau, des cinq domaines à l'outil ; « story » : avec compteur et actes (ordinateur).
     * « intro » montre les cinq domaines de 2019 dès que le tableau arrive à l'écran (pas de grand
     * vide en attendant) ; « timeline » raconte 2025 et 2026 (sur ordinateur, au défilement).
     */
    const build = (intro: gsap.core.Timeline, timeline: gsap.core.Timeline, story: boolean) => {
      strips.forEach((strip, i) => {
        const digit = Number(list[0]?.[i] ?? 0);
        gsap.set(strip, { yPercent: -digit * 10, y: 0 });
        gsap.set(strip.parentElement, { width: widths[i]?.[digit] ?? 'auto' });
      });
      if (story) {
        gsap.set(acts, { opacity: 0.22 });
        gsap.set(captions, { autoAlpha: 0, y: 12 });
        focus(intro, 0, 0);
      }

      // 2019 : le premier repère, puis les cinq domaines, un à un, et leurs noms.
      intro.from(
        marks[0] ?? [],
        {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(2)',
        },
        0,
      );
      for (let i = 0; i < added; i += 1) reveal(intro, i, 0.2 + i * 0.3);
      intro.fromTo(hole ?? [], { opacity: 0 }, { opacity: 1, duration: 0.5 });

      // 2019 → 2025 : la frise avance, droite ; le sixième domaine surgit à la place libre.
      timeline.addLabel('road', intro === timeline ? '+=0.4' : 0.2);
      if (story) focus(timeline, 1, 'road');
      timeline.fromTo(
        fill,
        { scaleX: 0 },
        { scaleX: MARKS[1]! / 100, duration: 2, ease: 'none' },
        'road',
      );
      roll(timeline, 1, 'road+=0.5');
      timeline.from(marks[1] ?? [], { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
      reveal(timeline, added, '-=0.1', true);
      timeline.to(hole ?? [], { opacity: 0, duration: 0.3 }, '<');
      // Le temps de son arrivée, le sixième domaine est en vert (cadre, pastille, année).
      timeline
        .fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '<')
        .fromTo(newIcon, blue.icon, { ...green.icon, duration: 0.4 }, '<')
        .fromTo(newYear, blue.year, { ...green.year, duration: 0.4 }, '<');

      // 2026 : l'IA fait son apparition. La bande balaie le tableau et pose un badge sur chaque
      // domaine au moment où elle le traverse. Le sixième domaine n'est plus nouveau : il
      // reprend les couleurs des autres.
      timeline.addLabel('tool', '+=1.1');
      if (story) focus(timeline, 2, 'tool');
      roll(timeline, 2, 'tool');
      timeline
        .to(frame, { opacity: 0, duration: 0.6 }, 'tool')
        .to(newIcon, { ...blue.icon, duration: 0.6 }, 'tool')
        .to(newYear, { ...blue.year, duration: 0.6 }, 'tool');
      timeline
        .to(fill, { scaleX: MARKS[2]! / 100, duration: 0.7, ease: 'none' }, 'tool')
        .from(marks[2] ?? [], { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' })
        .addLabel('sweep');
      const sweep = 2.2;
      if (scan) {
        timeline
          .set(scan, { opacity: 1 }, 'sweep')
          .fromTo(
            scan,
            { x: () => -dir * scan.offsetWidth },
            { x: () => dir * board.clientWidth, duration: sweep, ease: 'power1.inOut' },
            'sweep',
          )
          .set(scan, { opacity: 0 });
      }
      badges.forEach((badge, i) => {
        const slot = slots[i];
        const center = slot ? (slot.offsetLeft + slot.offsetWidth / 2) / board.clientWidth : 0;
        const at = Math.min(1, Math.max(0, rtl ? 1 - center : center));
        timeline.from(
          badge,
          { scale: 0, opacity: 0, duration: 0.45, ease: 'back.out(2.5)' },
          `sweep+=${(at * sweep * 0.9).toFixed(2)}`,
        );
      });
      timeline.from(ahead ?? [], { opacity: 0, duration: 0.6 }, `sweep+=${sweep}`);
      if (story) timeline.to({}, { duration: 1.2 }); // un temps pour relire le récit complet
    };

    const media = gsap.matchMedia(story);
    media.add(
      {
        pin: '(min-width: 64em) and (min-height: 34em)',
        flow: '(min-width: 64em) and (max-height: 33.99em)',
        small: '(max-width: 63.99em)',
      },
      (context) => {
        const { pin, small } = context.conditions ?? {};
        const top = () => parseFloat(getComputedStyle(story).scrollMarginTop) || 0;
        const content = story.firstElementChild;
        const unfit =
          pin && content instanceof HTMLElement
            ? fitToScreen(content, () => window.innerHeight - top() - 16)
            : undefined;
        // Les cinq domaines de 2019 se posent dès que le tableau entre à l'écran.
        const intro = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: board, start: 'top 85%', once: true },
        });
        // Téléphone : tout s'enchaîne d'un trait ; ordinateur : 2025 et 2026 au défilement.
        const timeline = small
          ? intro
          : gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: pin
                ? {
                    trigger: story,
                    start: () => `center ${top() + (window.innerHeight - top()) / 2}px`,
                    end: '+=1600',
                    scrub: 0.7,
                    pin: true,
                    anticipatePin: 1,
                  }
                : { trigger: story, start: 'top 60%', end: 'bottom 40%', scrub: 0.7 },
            });
        build(intro, timeline, !small);
        return unfit;
      },
    );
    return () => media.revert();
  }, [rtl, years, added]);

  const last = milestones.length - 1;

  return (
    <div ref={ref} className={styles.story}>
      <div className={styles.storyGrid}>
        <div className={styles.copy}>
          <YearRoller years={years.split(' ')} />
          <div className={styles.captions} aria-hidden="true">
            {milestones.map((milestone, index) => (
              <p
                key={milestone.year}
                className={styles.caption}
                data-caption={index}
                data-final={index === last || undefined}
              >
                <span className={styles.captionTitle}>{milestone.title}</span>
                <span className={styles.captionText}>{milestone.text}</span>
              </p>
            ))}
          </div>
          <div className={styles.text}>
            {text.map((act, index) => (
              <p key={index} className={styles.act} data-act={index}>
                <Act text={act} />
              </p>
            ))}
          </div>
        </div>

        {/* Le tableau des domaines : une image pour les lecteurs d'écran (son texte la décrit). */}
        <div className={styles.artFrame} role="img" aria-label={alt}>
          <div className={styles.board} data-board aria-hidden="true">
            <div className={styles.cardsWrap}>
              <ul className={styles.cards}>
                {domains.map((domain, index) => {
                  const Icon = DOMAIN_ICONS[index] ?? StrategyIcon;
                  const isNew = index === added;
                  return (
                    <li key={domain} className={styles.slot} data-slot>
                      {/* La place libre du sixième domaine, en pointillé, jusqu'en 2025. */}
                      {isNew && <span className={styles.hole} data-hole />}
                      <div className={styles.card} data-card>
                        {isNew && <span className={styles.newFrame} data-frame />}
                        <span className={styles.cardIcon} data-icon>
                          <Icon size={24} weight="duotone" />
                        </span>
                        <span className={styles.cardName} data-name>
                          {domain}
                        </span>
                        <span className={styles.cardYear} data-year>
                          {milestones[isNew ? 1 : 0]?.year}
                        </span>
                        {/* 2026 : l'IA, un outil posé sur chaque domaine. */}
                        <span className={styles.aiBadge} data-badge>
                          <CpuIcon size={14} weight="bold" />
                          {aiTag}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* La bande de 2026, qui balaie le tableau (invisible sans script). */}
              <span className={styles.scan} data-scan />
            </div>

            {/* La frise : droite et ferme, 2019, 2025, 2026, puis la suite en pointillé. */}
            <div className={styles.track}>
              <span className={styles.trackLine} />
              <span className={styles.trackFill} data-fill />
              <span className={styles.trackAhead} data-ahead />
              {milestones.map((milestone, index) => (
                <span
                  key={milestone.year}
                  className={styles.trackMark}
                  style={{ insetInlineStart: `${MARKS[index] ?? 0}%` }}
                  data-mark
                  data-new={index === 1 || undefined}
                >
                  <span className={styles.trackDot} />
                  <span className={styles.trackYear}>{milestone.year}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
