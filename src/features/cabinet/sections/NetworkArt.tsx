import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useId, useRef, type CSSProperties } from 'react';
import type { CabinetContent } from '../content';
import { motionAllowed } from '../useCabinetMotion';
import { NETWORK_MAPS, type NetworkMap } from './networkMap';
import styles from './Network.module.css';

/*
 * « Notre réseau d'experts », en carte : les terres d'Europe, d'Afrique du Nord et du Moyen-Orient
 * en points gris (le vivier) ; l'Algérie, dessinée par ses propres points teintés de bleu, porte
 * l'équipe : sept points bleu OPEM reliés entre eux ; un arc pointillé quitte le territoire,
 * franchit la Méditerranée et aboutit à un point ambre, seule touche d'ambre du bloc. Points
 * générés par scripts/gen-carte-reseau.mjs (networkMap.ts). Deux compositions : large
 * (ordinateur et tablette) et haute (téléphone) ; légendes en texte HTML, toujours lisibles.
 * Une vraie carte ne se retourne pas : en arabe, seules les légendes changent.
 */

type Align = 'start' | 'center' | 'end';
type Legend = { x: number; y: number; align: Align };
type Scene = {
  map: NetworkMap;
  member: number; // rayon d'un membre
  line: number; // épaisseur des liens et de l'arc
  legends: { pool: Legend; team: Legend; beyond: Legend };
};

/** Les liens qui unissent les sept membres (le premier est au centre). */
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

const center = (map: NetworkMap) => map.team[0] ?? [map.w / 2, map.h / 2];

const SCENES: Record<'wide' | 'narrow', Scene> = {
  wide: {
    map: NETWORK_MAPS.wide,
    member: 0.82,
    line: 0.17,
    legends: {
      pool: { x: 1, y: 2.4, align: 'start' },
      team: { x: center(NETWORK_MAPS.wide)[0], y: 42.2, align: 'center' },
      beyond: {
        x: NETWORK_MAPS.wide.beyond[0] + 2,
        y: NETWORK_MAPS.wide.beyond[1],
        align: 'start',
      },
    },
  },
  narrow: {
    map: NETWORK_MAPS.narrow,
    member: 0.95,
    line: 0.24,
    legends: {
      pool: { x: 1, y: 2.4, align: 'start' },
      team: { x: center(NETWORK_MAPS.narrow)[0], y: 46.6, align: 'center' },
      beyond: {
        x: NETWORK_MAPS.narrow.beyond[0] - 3.6,
        y: NETWORK_MAPS.narrow.beyond[1],
        align: 'end',
      },
    },
  },
};

function MapScene({
  scene,
  legends,
  id,
  className,
}: {
  scene: Scene;
  legends: CabinetContent['network']['legends'];
  id: string;
  className: string | undefined;
}) {
  const { map, member, line } = scene;
  const [cx, cy] = center(map);
  const reach = Math.hypot(Math.max(cx, map.w - cx), Math.max(cy, map.h - cy)) + 2;

  const legend = (key: keyof typeof legends) => {
    const { x, y, align } = scene.legends[key];
    const style = { left: `${(x / map.w) * 100}%`, top: `${(y / map.h) * 100}%` } as CSSProperties;
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
    <div className={className}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${map.w} ${map.h}`}
        style={{ aspectRatio: `${map.w} / ${map.h}` }}
        focusable="false"
      >
        <defs>
          {/* La carte paraît en vague, depuis l'Algérie. */}
          <mask
            id={`${id}-wave`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={map.w}
            height={map.h}
          >
            <circle cx={cx} cy={cy} r={reach} fill="#fff" data-c="wave" />
          </mask>
          {/* L'arc se découvre du départ à l'arrivée. */}
          <mask
            id={`${id}-arc`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={map.w}
            height={map.h}
          >
            <path
              d={map.arc}
              className={styles.arcMask}
              strokeWidth={line * 8}
              pathLength={1}
              data-c="arc"
            />
          </mask>
        </defs>

        <g mask={`url(#${id}-wave)`}>
          <path className={styles.land} d={map.land} />
          <path className={styles.home} d={map.home} data-c="home" />
        </g>

        <path
          className={styles.arc}
          d={map.arc}
          strokeWidth={line}
          strokeDasharray={`${line * 1.6} ${line * 3.4}`}
          mask={`url(#${id}-arc)`}
        />

        <g className={styles.links} strokeWidth={line}>
          {LINKS.map(([a, b]) => {
            const from = map.team[a];
            const to = map.team[b];
            if (!from || !to) return null;
            return (
              <line
                key={`${a}-${b}`}
                x1={from[0]}
                y1={from[1]}
                x2={to[0]}
                y2={to[1]}
                pathLength={1}
                data-c="link"
              />
            );
          })}
        </g>
        {map.team.map(([x, y], index) => (
          <circle
            key={`${x}-${y}`}
            className={styles.member}
            cx={x}
            cy={y}
            r={member}
            strokeWidth={member * 0.3}
            data-c="member"
            data-fx={map.starts[index]?.[0] ?? x}
            data-fy={map.starts[index]?.[1] ?? y}
          />
        ))}
        <circle
          className={styles.beyond}
          cx={map.beyond[0]}
          cy={map.beyond[1]}
          r={member * 1.05}
          strokeWidth={member * 0.25}
          data-c="beyond"
        />
      </svg>
      {legend('pool')}
      {legend('team')}
      {legend('beyond')}
    </div>
  );
}

/**
 * La carte du réseau, sur toute la largeur (à la taille de l'écran). Au défilement, la carte se
 * fige le temps de sa scène, une seule : elle paraît en vague depuis l'Algérie, qui prend sa
 * teinte ; les sept experts quittent le vivier, convergent et se relient ; puis l'arc se trace
 * jusqu'au point ambre et les légendes se posent. En mouvement réduit : la scène finale, immobile.
 */
export function NetworkArt({ network }: { network: CabinetContent['network'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const figure = ref.current;
    if (!figure || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    // Écran assez haut : la carte (à la taille de l'écran) se fige sous le menu et la barre des
    // rubriques, et la scène avance avec la molette ; sinon, elle se joue une fois à l'arrivée.
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
              end: '+=110%',
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
            }
          : undefined,
      });
      timeline
        .from('[data-c="wave"]', { attr: { r: 0 }, duration: 1.5, ease: 'power2.out' })
        .from('[data-c="home"]', { stroke: '#c0cacf', duration: 0.8 }, 0.5);
      figure.querySelectorAll<SVGCircleElement>('[data-c="member"]').forEach((member, i) => {
        timeline.from(
          member,
          {
            attr: { cx: Number(member.dataset.fx), cy: Number(member.dataset.fy) },
            fill: '#c0cacf',
            opacity: 0,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          0.5 + (i % 7) * 0.08,
        );
      });
      timeline
        .fromTo(
          '[data-c="link"]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.5, stagger: 0.03 },
          '-=0.5',
        )
        .from('[data-c="label"][data-tone="pool"]', { opacity: 0, duration: 0.5 }, 0.4)
        .from('[data-c="label"][data-tone="team"]', { opacity: 0, y: 8, duration: 0.6 }, '-=0.3')
        .fromTo(
          '[data-c="arc"]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' },
        )
        .from(
          '[data-c="beyond"]',
          {
            attr: { r: 0 },
            duration: 0.7,
            ease: 'back.out(2.4)',
          },
          '-=0.15',
        )
        .from('[data-c="label"][data-tone="beyond"]', { opacity: 0, y: 8, duration: 0.6 });
      if (pin) {
        timeline.to({}, { duration: 1.2 }); // un temps sur la scène complète
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
      <MapScene
        scene={SCENES.wide}
        legends={network.legends}
        id={`${id}w`}
        className={styles.wide}
      />
      <MapScene
        scene={SCENES.narrow}
        legends={network.legends}
        id={`${id}n`}
        className={styles.narrow}
      />
    </div>
  );
}
