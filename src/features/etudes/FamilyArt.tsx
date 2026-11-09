import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import styles from './FamilyArt.module.css';

/*
 * Bloc 02, image de chaque famille, dans l'esprit de la maquette C1 « Le croisement des plans
 * d'analyse » : une scène en perspective isométrique, traits blancs et plans translucides sur le
 * bandeau bleu nuit, un seul cube ambre (la décision éclairée), seule touche d'ambre de l'image.
 * 01 Investir et développer : trois plans d'analyse se croisent sur le cube.
 * 02 S'allier et se positionner : un marché de volumes, deux d'entre eux reliés et cernés ensemble.
 * 03 Évaluer et préserver : cercles d'impact, points de mesure et un dôme qui protège le cube.
 * 04 Observer, évaluer et anticiper : des colonnes de données, puis des trajectoires possibles.
 * Aucun dégradé : halos en disques pleins translucides. Image décorative (aria-hidden) : tout le
 * sens est dans le texte voisin. La scène se monte quand elle arrive à l'écran ; sans script ou
 * avec moins d'animations, elle est fixe et complète.
 */

const W = 600;
const H = 440;
const S = 36; // une unité de la scène, en pixels
const O = { x: 300, y: 262 };
const RX = 1.2247; // un cercle au sol devient une ellipse : demi-axes 1,22·r et 0,71·r
const RY = 0.7071;

type V = [number, number, number];

/** Projection isométrique : x vers la droite et le bas, y vers la gauche et le bas, z vers le haut. */
const at = ([x, y, z]: V): [number, number] => [
  O.x + (x - y) * 0.866 * S,
  O.y + (x + y) * 0.5 * S - z * S,
];
const fmt = (n: number) => Math.round(n * 10) / 10;
const points = (vs: V[]) =>
  vs
    .map(at)
    .map(([x, y]) => `${fmt(x)},${fmt(y)}`)
    .join(' ');
const line = (vs: V[]) =>
  vs
    .map(at)
    .map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`)
    .join('');

type Tone = 'amber' | 'glass' | 'solid';

/** Un volume vu du dessus : sa face supérieure et ses deux faces avant. */
function Box({ o, d, tone }: { o: V; d: V; tone: Tone }) {
  const [x, y, z] = o;
  const [dx, dy, dz] = d;
  const top: V[] = [
    [x, y, z + dz],
    [x + dx, y, z + dz],
    [x + dx, y + dy, z + dz],
    [x, y + dy, z + dz],
  ];
  const right: V[] = [
    [x + dx, y, z + dz],
    [x + dx, y + dy, z + dz],
    [x + dx, y + dy, z],
    [x + dx, y, z],
  ];
  const left: V[] = [
    [x, y + dy, z + dz],
    [x + dx, y + dy, z + dz],
    [x + dx, y + dy, z],
    [x, y + dy, z],
  ];
  return (
    <g className={styles[tone]} data-a={tone === 'amber' ? undefined : 'box'}>
      <polygon className={styles.faceTop} points={points(top)} />
      <polygon className={styles.faceRight} points={points(right)} />
      <polygon className={styles.faceLeft} points={points(left)} />
    </g>
  );
}

/** Le sol : un carré de huit unités, quadrillé finement. */
function Ground({ size = 4 }: { size?: number }) {
  const ticks = Array.from({ length: size * 2 - 1 }, (_, i) => i - size + 1);
  return (
    <g data-a="ground">
      <polygon
        className={styles.plane}
        points={points([
          [-size, -size, 0],
          [size, -size, 0],
          [size, size, 0],
          [-size, size, 0],
        ])}
      />
      <path
        className={styles.grid}
        d={ticks
          .map(
            (k) =>
              line([
                [k, -size, 0],
                [k, size, 0],
              ]) +
              line([
                [-size, k, 0],
                [size, k, 0],
              ]),
          )
          .join('')}
      />
    </g>
  );
}

/** Un cercle posé au sol (ou à la hauteur z), vu en perspective. */
function Ring({ c = [0, 0, 0], r, className }: { c?: V; r: number; className?: string }) {
  const [cx, cy] = at(c);
  return (
    <ellipse
      className={className}
      cx={fmt(cx)}
      cy={fmt(cy)}
      rx={fmt(RX * r * S)}
      ry={fmt(RY * r * S)}
    />
  );
}

/** Le halo ambre derrière le cube : un disque plein, translucide. */
function Halo({ c, r }: { c: V; r: number }) {
  const [cx, cy] = at(c);
  return <circle className={styles.halo} cx={fmt(cx)} cy={fmt(cy)} r={r} />;
}

/** Un point blanc au bout d'un trait. */
function Node({ v, r = 3.5 }: { v: V; r?: number }) {
  const [cx, cy] = at(v);
  return <circle className={styles.node} cx={fmt(cx)} cy={fmt(cy)} r={r} />;
}

/** Le cube ambre, qui descend se poser puis flotte doucement. */
function Accent({ o, d, halo }: { o: V; d: V; halo: number }) {
  const c: V = [o[0] + d[0] / 2, o[1] + d[1] / 2, o[2] + d[2] / 2];
  return (
    <g data-a="float">
      <g data-a="accent">
        <Halo c={c} r={halo} />
        <Box o={o} d={d} tone="amber" />
      </g>
    </g>
  );
}

/** Une grille de points sur un plan vertical. */
function dots(f: (u: number, v: number) => V, cols: number, rows: number) {
  const out: ReactNode[] = [];
  for (let i = 0; i < cols; i += 1)
    for (let j = 0; j < rows; j += 1) {
      const [cx, cy] = at(f(i / (cols - 1), j / (rows - 1)));
      out.push(<circle key={`${i}-${j}`} cx={fmt(cx)} cy={fmt(cy)} r={1.3} />);
    }
  return (
    <g className={styles.dots} data-a="line">
      {out}
    </g>
  );
}

/** 01 Investir et développer : le croisement des plans d'analyse. */
function Crossing() {
  const low = -1.4;
  const high = 3.8;
  const waves = [0, 1, 2, 3].map((k) =>
    line(
      Array.from({ length: 25 }, (_, i): V => {
        const x = -3.7 + (i / 24) * 3.2;
        return [x, 0, 1.6 + k * 0.42 + 0.32 * Math.sin(x * 1.7 + k * 0.6)];
      }),
    ),
  );
  return (
    <>
      <Ring r={5.6} className={styles.orbit} />
      <Ground />
      <polygon
        className={styles.plane}
        data-a="plane"
        points={points([
          [-4, 0, low],
          [4, 0, low],
          [4, 0, high],
          [-4, 0, high],
        ])}
      />
      <path className={styles.wave} data-a="line" d={waves.join('')} />
      <polygon
        className={styles.plane}
        data-a="plane"
        points={points([
          [0, -4, low],
          [0, 4, low],
          [0, 4, high],
          [0, -4, high],
        ])}
      />
      {dots((u, v) => [0, -3.6 + u * 2.6, 0.5 + v * 2.9], 9, 10)}
      <g data-a="line">
        <path
          className={styles.axis}
          d={line([
            [0, 0, -2.6],
            [0, 0, 5.6],
          ])}
        />
        <Node v={[0, 0, 5.6]} />
        <Node v={[0, 0, -2.6]} />
        <Node v={[4, 0, high]} r={3} />
        <Node v={[-4, 4, 0]} r={3} />
      </g>
      <Accent o={[-0.85, -0.85, -0.85]} d={[1.7, 1.7, 1.7]} halo={62} />
    </>
  );
}

/** 02 S'allier et se positionner : deux volumes reliés au milieu d'un marché. */
function Alliance() {
  const market: [number, number, number][] = [
    [-3.4, -3.0, 0.9],
    [-3.2, 1.3, 1.3],
    [-1.6, 2.7, 0.7],
    [0.6, 2.4, 1.1],
    [2.5, 1.0, 0.8],
    [2.9, -1.4, 1.2],
    [-0.4, -3.6, 0.6],
    [-1.2, 0.6, 0.5],
  ];
  const partner: V = [-2.6, -1.9, 0];
  const self: V = [0.9, -2.0, 0];
  const [ax, ay] = at([partner[0] + 0.55, partner[1] + 0.55, 1.5]);
  const [bx, by] = at([self[0] + 0.55, self[1] + 0.55, 2.2]);
  return (
    <>
      <Ring r={5.6} className={styles.orbit} />
      <Ground />
      <g data-a="line">
        <path
          className={styles.axis}
          d={
            line([
              [0, -4.8, 0],
              [0, 4.8, 0],
            ]) +
            line([
              [-4.8, 0, 0],
              [4.8, 0, 0],
            ])
          }
        />
        <Node v={[0, -4.8, 0]} r={3} />
        <Node v={[4.8, 0, 0]} r={3} />
        <Node v={[0, 4.8, 0]} r={3} />
        <Node v={[-4.8, 0, 0]} r={3} />
        <Ring c={[-0.85, -1.4, 0]} r={2.6} className={styles.zone} />
      </g>
      {market
        .filter(([x, y]) => x + y < -1.5)
        .map(([x, y, h]) => (
          <Box key={`${x}${y}`} o={[x, y, 0]} d={[0.8, 0.8, h]} tone="glass" />
        ))}
      <Box o={partner} d={[1.1, 1.1, 1.5]} tone="solid" />
      <path
        className={styles.link}
        data-a="line"
        d={`M${fmt(ax)} ${fmt(ay)}Q${fmt((ax + bx) / 2)} ${fmt(Math.min(ay, by) - 90)} ${fmt(bx)} ${fmt(by)}`}
      />
      <Accent o={self} d={[1.1, 1.1, 2.2]} halo={50} />
      {market
        .filter(([x, y]) => x + y >= -1.5)
        .map(([x, y, h]) => (
          <Box key={`${x}${y}`} o={[x, y, 0]} d={[0.8, 0.8, h]} tone="glass" />
        ))}
    </>
  );
}

/** 03 Évaluer et préserver : cercles d'impact, points de mesure, un dôme sur le cube. */
function Preserve() {
  const R = 2.5;
  const [cx, cy] = at([0, 0, 0]);
  const radius = RX * R * S;
  const stakes = [200, 250, 300, 20, 70, 120].map((deg): V => {
    const a = (deg * Math.PI) / 180;
    return [3.6 * Math.cos(a), 3.6 * Math.sin(a), 0];
  });
  return (
    <>
      <Ground />
      <g data-a="line">
        <Ring r={1.5} className={styles.ring} />
        <Ring r={3.6} className={styles.zone} />
        <Ring r={4.9} className={styles.orbit} />
      </g>
      {stakes
        .filter(([x, y]) => x + y < 0)
        .map((v) => (
          <Stake key={v.join()} v={v} />
        ))}
      <Accent o={[-0.6, -0.6, 0]} d={[1.2, 1.2, 1.2]} halo={46} />
      <g data-a="plane">
        <path
          className={styles.dome}
          d={`M${fmt(cx - radius)} ${fmt(cy)}A${fmt(radius)} ${fmt(radius)} 0 0 1 ${fmt(cx + radius)} ${fmt(cy)}A${fmt(radius)} ${fmt(RY * R * S)} 0 0 1 ${fmt(cx - radius)} ${fmt(cy)}Z`}
        />
        <Ring c={[0, 0, R * 0.62]} r={R * 0.78} className={styles.ring} />
        <Ring r={R} className={styles.ring} />
      </g>
      {stakes
        .filter(([x, y]) => x + y >= 0)
        .map((v) => (
          <Stake key={v.join()} v={v} />
        ))}
    </>
  );
}

/** Un point de mesure : un trait vertical, un point blanc au sommet. */
function Stake({ v }: { v: V }) {
  const top: V = [v[0], v[1], 1.3];
  return (
    <g data-a="box">
      <path className={styles.axis} d={line([v, top])} />
      <Node v={top} r={3} />
    </g>
  );
}

/** 04 Observer, évaluer et anticiper : des colonnes de données, puis trois trajectoires. */
function Foresight() {
  const x = -1.2;
  // Du plus loin au plus proche (ordre de dessin) : la série monte vers le fond, à droite.
  const columns: [number, number][] = [
    [-0.7, 2.2],
    [0.4, 1.3],
    [1.5, 1.6],
    [2.6, 1.0],
  ];
  const tops = columns.map(([y, h]): V => [x + 0.4, y + 0.4, h]);
  const last = tops[0] ?? [0, 0, 0];
  const ahead = -3.6;
  const cube: V = [x - 0.05, ahead - 0.45, 2.15];
  const chosen: V = [x + 0.4, ahead, 2.6];
  const high: V = [x + 0.4, ahead, 3.9];
  const low: V = [x + 0.4, ahead, 1.1];
  const hollow = (v: V) => {
    const [cx, cy] = at(v);
    return <circle className={styles.hollow} cx={fmt(cx)} cy={fmt(cy)} r={5} />;
  };
  return (
    <>
      <Ring r={5.6} className={styles.orbit} />
      <Ground />
      <polygon
        className={styles.plane}
        data-a="plane"
        points={points([
          [-4, 4, 0],
          [-4, -4, 0],
          [-4, -4, 3.2],
          [-4, 4, 3.2],
        ])}
      />
      {dots((u, v) => [-4, 3.5 - u * 7, 0.5 + v * 2.3], 14, 5)}
      <g data-a="line">
        <path
          className={styles.axis}
          d={line([
            [chosen[0], chosen[1], 0],
            [chosen[0], chosen[1], cube[2]],
          ])}
        />
        <polygon
          className={styles.shadow}
          points={points([
            [cube[0], cube[1], 0],
            [cube[0] + 0.9, cube[1], 0],
            [cube[0] + 0.9, cube[1] + 0.9, 0],
            [cube[0], cube[1] + 0.9, 0],
          ])}
        />
      </g>
      {columns.map(([y, h]) => (
        <Box key={y} o={[x, y, 0]} d={[0.8, 0.8, h]} tone="glass" />
      ))}
      <g data-a="line">
        <path className={styles.link} d={line([...tops].reverse())} />
        {tops.map((v) => (
          <Node key={v.join()} v={v} r={3} />
        ))}
        <path className={styles.zone} d={line([last, high])} />
        <path className={styles.zone} d={line([last, low])} />
        <path className={styles.trend} d={line([last, chosen])} />
        {hollow(high)}
        {hollow(low)}
      </g>
      <Accent o={cube} d={[0.9, 0.9, 0.9]} halo={40} />
    </>
  );
}

const SCENES = [Crossing, Alliance, Preserve, Foresight];

/** Joue la montée de la scène une fois, quand elle arrive à l'écran ; puis le cube flotte. */
export function FamilyArt({ index }: { index: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const Scene = SCENES[index % SCENES.length] ?? Crossing;

  useEffect(() => {
    const svg = ref.current;
    if (!svg || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const all = (a: string) => gsap.utils.toArray<SVGElement>(`[data-a="${a}"]`, svg);
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: svg, start: 'top 82%', once: true },
      });
      timeline.from(all('ground'), { opacity: 0, y: 28, duration: 1 }, 0);
      const planes = all('plane');
      if (planes.length)
        timeline.from(planes, { opacity: 0, y: 36, duration: 1, stagger: 0.18 }, 0.2);
      const lines = all('line');
      if (lines.length) timeline.from(lines, { opacity: 0, duration: 0.9, stagger: 0.08 }, 0.5);
      const boxes = all('box');
      if (boxes.length)
        timeline.from(boxes, { opacity: 0, y: 22, duration: 0.7, stagger: 0.07 }, 0.6);
      timeline.from(all('accent'), { opacity: 0, y: -80, duration: 1.2, ease: 'back.out(1.5)' }, 1);
      timeline.add(
        gsap.to(all('float'), { y: -7, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      );
      gsap.to(svg.querySelectorAll(`.${styles.orbit}`), {
        strokeDashoffset: -240,
        duration: 24,
        ease: 'none',
        repeat: -1,
      });
    }, svg);
    return () => context.revert();
  }, []);

  return (
    <svg
      ref={ref}
      className={styles.art}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      focusable="false"
    >
      <Scene />
    </svg>
  );
}
