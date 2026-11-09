import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useId, useRef, type CSSProperties } from 'react';
import type { CabinetContent } from '../content';
import { motionAllowed } from '../useCabinetMotion';
import styles from './Network.module.css';

/*
 * « Notre réseau d'experts », en constellation, sur un panneau bleu nuit (le bloc reste blanc).
 * Un ciel d'étoiles : le vivier, dense à l'intérieur d'une frontière en pointillé, clairsemé
 * au-dehors. Sept étoiles s'y allument une à une et se relient : votre équipe. Puis un trait
 * franchit la frontière et aboutit à une étoile ambre, seule touche d'ambre du bloc : ce qui
 * manque ici, nous allons le chercher au-delà des frontières. Deux compositions : large
 * (ordinateur et tablette) et haute (téléphone) ; légendes en texte HTML, toujours lisibles.
 * Aucun dégradé : les halos sont des disques pleins, translucides. Le bleu OPEM ne touche jamais
 * le bleu nuit : étoiles blanches et bleu 30 %.
 */

type Point = [number, number];
type Align = 'start' | 'center' | 'end';
type Legend = { x: number; y: number; align: Align };
type Star = { x: number; y: number; r: number; o: number; twinkle?: { d: number; t: number } };

type Scene = {
  w: number;
  h: number;
  /** La frontière : une ellipse en pointillé autour du vivier. */
  frontier: { cx: number; cy: number; rx: number; ry: number };
  /** Les sept étoiles de l'équipe (la première au centre). */
  team: Point[];
  beyond: Point;
  /** Le trait vers l'au-delà : départ (indice d'un membre) et point de contrôle de la courbe. */
  arc: { from: number; control: Point };
  member: number; // rayon d'une étoile de l'équipe
  line: number; // épaisseur des liens
  density: { vivier: number; sky: number };
  /** Une étoile filante, de temps en temps, dans le ciel au-dehors : départ et arrivée. */
  shooting: [Point, Point];
  seed: number;
  legends: { pool: Legend; team: Legend; beyond: Legend };
};

/** Les liens de la constellation : un anneau de six étoiles, le centre relié à quatre d'entre elles. */
const LINKS: [number, number][] = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 1],
  [0, 1],
  [0, 3],
  [0, 4],
  [0, 6],
];

const SCENES: Record<'wide' | 'narrow', Scene> = {
  wide: {
    w: 160,
    h: 84,
    frontier: { cx: 72, cy: 44, rx: 60, ry: 34 },
    team: [
      [72, 46],
      [58, 38],
      [71, 29],
      [87, 33],
      [90, 49],
      [77, 61],
      [57, 56],
    ],
    beyond: [146, 16],
    arc: { from: 3, control: [118, 4] },
    member: 1.05,
    line: 0.16,
    density: { vivier: 170, sky: 120 },
    shooting: [
      [30, 3],
      [56, 15],
    ],
    seed: 7,
    legends: {
      pool: { x: 6, y: 7, align: 'start' },
      team: { x: 74, y: 70.5, align: 'center' },
      beyond: { x: 151, y: 23.5, align: 'end' },
    },
  },
  narrow: {
    w: 90,
    h: 128,
    frontier: { cx: 45, cy: 77, rx: 41, ry: 44 },
    team: [
      [45, 78],
      [32, 68],
      [45, 61],
      [58, 66],
      [60, 82],
      [48, 94],
      [31, 88],
    ],
    beyond: [74, 13],
    arc: { from: 3, control: [80, 42] },
    member: 1.3,
    line: 0.22,
    density: { vivier: 120, sky: 70 },
    shooting: [
      [8, 26],
      [26, 37],
    ],
    seed: 11,
    legends: {
      pool: { x: 5, y: 5, align: 'start' },
      team: { x: 46, y: 104, align: 'center' },
      beyond: { x: 70, y: 13, align: 'end' },
    },
  },
};

/** Hasard reproductible (même ciel à chaque rendu, côté serveur comme côté navigateur). */
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Le ciel d'une scène : le vivier dans la frontière, quelques étoiles pâles au-dehors. */
function skyOf(scene: Scene) {
  const rand = random(scene.seed);
  const { cx, cy, rx, ry } = scene.frontier;
  const inside = (x: number, y: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;
  // Pas d'étoile collée à un membre, à l'étoile ambre ni sous une légende.
  const clear = (x: number, y: number) =>
    scene.team.every(([tx, ty]) => Math.hypot(x - tx, y - ty) > scene.member * 2.6) &&
    Math.hypot(x - scene.beyond[0], y - scene.beyond[1]) > scene.member * 7;
  const vivier: Star[] = [];
  const sky: Star[] = [];
  let guard = 0;
  while (vivier.length < scene.density.vivier && guard++ < 20000) {
    const x = rand() * scene.w;
    const y = rand() * scene.h;
    if (!inside(x, y) || !clear(x, y)) continue;
    const big = rand();
    vivier.push({
      x: round(x),
      y: round(y),
      r: round(0.14 + big ** 3 * 0.42),
      o: round(0.45 + rand() * 0.5),
      twinkle: rand() < 0.3 ? { d: round(rand() * 6), t: round(2.6 + rand() * 3.4) } : undefined,
    });
  }
  guard = 0;
  while (sky.length < scene.density.sky && guard++ < 20000) {
    const x = rand() * scene.w;
    const y = rand() * scene.h;
    if (inside(x, y) || !clear(x, y)) continue;
    sky.push({
      x: round(x),
      y: round(y),
      r: round(0.09 + rand() * 0.16),
      o: round(0.18 + rand() * 0.32),
      twinkle: rand() < 0.2 ? { d: round(rand() * 6), t: round(3 + rand() * 4) } : undefined,
    });
  }
  return { vivier, sky };
}

const SKIES = { wide: skyOf(SCENES.wide), narrow: skyOf(SCENES.narrow) };

function Stars({ stars }: { stars: Star[] }) {
  return stars.map((star) => (
    <circle
      key={`${star.x}-${star.y}`}
      cx={star.x}
      cy={star.y}
      r={star.r}
      opacity={star.o}
      className={star.twinkle ? styles.twinkle : undefined}
      style={
        star.twinkle
          ? ({ '--d': `${star.twinkle.d}s`, '--t': `${star.twinkle.t}s` } as CSSProperties)
          : undefined
      }
    />
  ));
}

function ConstellationScene({
  layout,
  legends,
  id,
}: {
  layout: 'wide' | 'narrow';
  legends: CabinetContent['network']['legends'];
  id: string;
}) {
  const scene = SCENES[layout];
  const { vivier, sky } = SKIES[layout];
  const { w, h, team, beyond, member, line, frontier } = scene;
  const [cx, cy] = team[0] ?? [w / 2, h / 2];
  const reach = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 2;
  const from = team[scene.arc.from] ?? [cx, cy];
  const arc = `M${from[0]} ${from[1]}Q${scene.arc.control[0]} ${scene.arc.control[1]} ${beyond[0]} ${beyond[1]}`;

  const legend = (key: keyof typeof legends) => {
    const { x, y, align } = scene.legends[key];
    const style = { left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` } as CSSProperties;
    return (
      <span
        className={styles.legend}
        data-align={align}
        data-tone={key}
        data-c="label"
        style={style}
      >
        {legends[key]}
      </span>
    );
  };

  return (
    <div className={layout === 'wide' ? styles.wide : styles.narrow}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${w} ${h}`}
        style={{ aspectRatio: `${w} / ${h}` }}
        focusable="false"
      >
        <defs>
          {/* Le ciel s'éclaire en vague, depuis le cœur de l'équipe. */}
          <mask id={`${id}-wave`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
            <circle cx={cx} cy={cy} r={reach} fill="#fff" data-c="wave" />
          </mask>
          {/* Le trait vers l'au-delà se découvre du départ à l'arrivée. */}
          <mask id={`${id}-arc`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
            <path
              d={arc}
              className={styles.arcMask}
              strokeWidth={line * 8}
              pathLength={1}
              data-c="arc"
            />
          </mask>
        </defs>

        <g mask={`url(#${id}-wave)`}>
          <g className={styles.sky} data-c="sky">
            <Stars stars={sky} />
            <path
              className={styles.shooting}
              d={`M${scene.shooting[0][0]} ${scene.shooting[0][1]}L${scene.shooting[1][0]} ${scene.shooting[1][1]}`}
              strokeWidth={line * 1.1}
              pathLength={1}
            />
          </g>
          <ellipse
            className={styles.frontier}
            cx={frontier.cx}
            cy={frontier.cy}
            rx={frontier.rx}
            ry={frontier.ry}
            strokeWidth={line * 0.9}
            strokeDasharray={`${line * 1.2} ${line * 4}`}
            data-c="frontier"
          />
          <g className={styles.vivier} data-c="vivier">
            <Stars stars={vivier} />
          </g>
        </g>

        <path
          className={styles.arc}
          d={arc}
          strokeWidth={line}
          strokeDasharray={`${line * 1.6} ${line * 3.4}`}
          mask={`url(#${id}-arc)`}
        />

        <g className={styles.links} strokeWidth={line}>
          {LINKS.map(([a, b]) => {
            const p = team[a];
            const q = team[b];
            if (!p || !q) return null;
            return (
              <line
                key={`${a}-${b}`}
                x1={p[0]}
                y1={p[1]}
                x2={q[0]}
                y2={q[1]}
                pathLength={1}
                data-c="link"
              />
            );
          })}
        </g>

        {/* Chaque membre : un halo plein et translucide, un anneau, un cœur blanc. */}
        {team.map(([x, y]) => (
          <g key={`${x}-${y}`} data-c="member">
            <circle className={styles.halo} cx={x} cy={y} r={member * 3.4} data-c="halo" />
            <circle
              className={styles.ring}
              cx={x}
              cy={y}
              r={member * 1.9}
              strokeWidth={line * 0.8}
              data-c="ring"
              data-r={member * 1.9}
            />
            <circle
              className={styles.core}
              cx={x}
              cy={y}
              r={member}
              data-c="core"
              data-r={member}
            />
          </g>
        ))}

        <g data-c="beyond">
          <circle className={styles.beyondHalo} cx={beyond[0]} cy={beyond[1]} r={member * 4.6} />
          <circle
            className={styles.beyondPulse}
            cx={beyond[0]}
            cy={beyond[1]}
            r={member * 2.4}
            strokeWidth={line}
          />
          <circle
            className={styles.beyond}
            cx={beyond[0]}
            cy={beyond[1]}
            r={member * 1.25}
            data-c="beyond-core"
            data-r={member * 1.25}
          />
        </g>
      </svg>
      {legend('pool')}
      {legend('team')}
      {legend('beyond')}
    </div>
  );
}

/**
 * La constellation du réseau, à la taille de l'écran. Au défilement, elle se fige le temps de sa
 * scène : le ciel s'éclaire en vague et dérive doucement (deux profondeurs) ; les sept étoiles de
 * l'équipe s'allument une à une et se relient ; puis le trait franchit la frontière jusqu'à
 * l'étoile ambre. Écran trop bas : la scène se joue une fois à l'arrivée. En mouvement réduit :
 * la scène finale, immobile, sans scintillement.
 */
export function NetworkArt({ network }: { network: CabinetContent['network'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const figure = ref.current;
    if (!figure || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(figure);
    media.add({ pin: '(min-height: 36em)', play: '(max-height: 35.99em)' }, (context) => {
      const pin = Boolean(context.conditions?.pin);
      const top = () => parseFloat(getComputedStyle(figure).scrollMarginTop) || 0;
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        paused: !pin,
        scrollTrigger: pin
          ? {
              trigger: figure,
              start: () => `top ${top()}px`,
              end: '+=130%',
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
            }
          : undefined,
      });

      // Le ciel s'éclaire, la frontière se pose.
      timeline
        .from('[data-c="wave"]', { attr: { r: 0 }, duration: 1.6, ease: 'power2.out' }, 0)
        .from('[data-c="frontier"]', { opacity: 0, duration: 0.9 }, 0.5)
        .from('[data-c="label"][data-tone="pool"]', { opacity: 0, y: 6, duration: 0.5 }, 0.7);

      // Les sept étoiles s'allument une à une : le cœur grandit et blanchit, l'anneau s'ouvre.
      figure.querySelectorAll<SVGGElement>('[data-c="member"]').forEach((member, i) => {
        const at = 1.1 + (i % 7) * 0.22;
        const core = member.querySelector<SVGCircleElement>('[data-c="core"]');
        const ring = member.querySelector<SVGCircleElement>('[data-c="ring"]');
        const halo = member.querySelector<SVGCircleElement>('[data-c="halo"]');
        if (core)
          timeline.fromTo(
            core,
            { attr: { r: Number(core.dataset.r) * 0.3 }, fill: '#b2cade', opacity: 0.6 },
            {
              attr: { r: Number(core.dataset.r) },
              fill: '#ffffff',
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
            },
            at,
          );
        if (ring)
          timeline.fromTo(
            ring,
            { attr: { r: 0 }, opacity: 1 },
            {
              attr: { r: Number(ring.dataset.r) },
              opacity: 0.55,
              duration: 0.6,
              ease: 'power3.out',
            },
            at + 0.05,
          );
        if (halo) timeline.from(halo, { opacity: 0, duration: 0.6 }, at + 0.05);
      });

      timeline
        .fromTo(
          '[data-c="link"]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.45, stagger: 0.05 },
          '+=0.05',
        )
        .from('[data-c="label"][data-tone="team"]', { opacity: 0, y: 8, duration: 0.6 }, '-=0.3')
        .fromTo(
          '[data-c="arc"]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' },
        )
        .from('[data-c="beyond"]', { opacity: 0, duration: 0.3 }, '-=0.15')
        .fromTo(
          '[data-c="beyond-core"]',
          { attr: { r: 0 } },
          {
            attr: { r: (_: number, el: SVGCircleElement) => Number(el.dataset.r) },
            duration: 0.7,
            ease: 'back.out(2.6)',
          },
          '<',
        )
        .from('[data-c="label"][data-tone="beyond"]', { opacity: 0, y: 8, duration: 0.6 });

      // Deux profondeurs de ciel qui dérivent, tout le long de la scène.
      const length = timeline.duration();
      timeline
        .fromTo('[data-c="sky"]', { x: 2.4 }, { x: -2.4, duration: length, ease: 'none' }, 0)
        .fromTo('[data-c="vivier"]', { x: 1 }, { x: -1, duration: length, ease: 'none' }, 0);

      if (pin) {
        timeline.to({}, { duration: 1.1 }); // un temps sur la scène complète
      } else {
        ScrollTrigger.create({
          trigger: figure,
          start: 'top 88%',
          once: true,
          onEnter: () => timeline.play(),
        });
      }
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={ref} className={styles.figure} role="img" aria-label={network.alt}>
      <ConstellationScene layout="wide" legends={network.legends} id={`${id}w`} />
      <ConstellationScene layout="narrow" legends={network.legends} id={`${id}n`} />
    </div>
  );
}
