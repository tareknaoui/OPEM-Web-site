import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import type { CabinetContent } from '../content';
import styles from './History.module.css';

/*
 * Scène isométrique (même projection que les illustrations du site), viewBox 1200 × 460 (de
 * y = 40 à 500). Trois piliers posés sur une ligne de sol, de plus en plus hauts (2019, 2025,
 * 2026), centrés sur les tiers de la largeur pour tomber sous les trois actes du texte ; sur
 * chacun, un petit cube par domaine ; en 2026, les six reliés en réseau à un cube vert (l'IA).
 */
const W = 1200;
const VIEW = { y: 40, h: 460 };
const S = 30; // pixels par unité
const C = Math.cos(Math.PI / 6);
const ORIGIN = { x: 600, y: 330 };

type Point = { x: number; y: number };
const P = (x: number, y: number, z: number): Point => ({
  x: ORIGIN.x + (x - y) * C * S,
  y: ORIGIN.y + (x + y) * 0.5 * S - z * S,
});
const pts = (list: Point[]) => list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

const SIDE = 4; // côté du pilier
const CUBE = 0.6; // côté d'un cube-domaine
const THIRD = W / 3 / (2 * C * S); // écart qui place les piliers au centre des tiers (x = 200, 600, 1000)
/** Pilier : position le long de la diagonale (horizontale à l'écran), hauteur, nombre de domaines. */
const STAGES = [
  { u: -THIRD, h: 1.6, domains: 5 },
  { u: 0, h: 3, domains: 6 },
  { u: THIRD, h: 4.6, domains: 6 },
] as const;
const LAST = STAGES.length - 1;

/** Boîte isométrique : ses trois faces visibles (dessus, face gauche +y, face droite +x). */
function box(x0: number, y0: number, z0: number, a: number, h: number) {
  const [x1, y1, z1] = [x0 + a, y0 + a, z0 + h];
  return {
    top: pts([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]),
    left: pts([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]),
    right: pts([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)]),
  };
}

const SCENE = STAGES.map((stage, index) => {
  const cx = stage.u;
  const cy = -stage.u;
  const x0 = cx - SIDE / 2;
  const y0 = cy - SIDE / 2;
  // Filets horizontaux sur les faces du pilier (un tous les 0,75), comme des étages.
  const floors: string[] = [];
  for (let z = 0.75; z < stage.h - 0.3; z += 0.75) {
    floors.push(pts([P(x0, y0 + SIDE, z), P(x0 + SIDE, y0 + SIDE, z), P(x0 + SIDE, y0, z)]));
  }
  // Cubes-domaines en couronne sur le dessus, triés du plus lointain au plus proche.
  const radius = 1.45;
  const cubes = Array.from({ length: stage.domains }, (_, i) => {
    const angle = -Math.PI / 4 - Math.PI / 2 + (i * 2 * Math.PI) / stage.domains;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return { i, x, y, depth: x + y };
  }).sort((a, b) => a.depth - b.depth);
  return {
    index,
    pillar: box(x0, y0, 0, SIDE, stage.h),
    shadow: pts([
      P(x0 - 0.5, y0 - 0.5, 0),
      P(x0 + SIDE + 0.5, y0 - 0.5, 0),
      P(x0 + SIDE + 0.5, y0 + SIDE + 0.5, 0),
      P(x0 - 0.5, y0 + SIDE + 0.5, 0),
    ]),
    floors,
    cubes: cubes.map((cube) => ({
      ...cube,
      faces: box(cube.x - CUBE / 2, cube.y - CUBE / 2, stage.h, CUBE, CUBE),
      foot: P(cube.x, cube.y, stage.h),
      isNew: index === 1 && cube.i === stage.domains - 1,
    })),
    core: index === LAST ? box(cx - 0.42, cy - 0.42, stage.h, 0.84, 1.05) : null,
    center: P(cx, cy, stage.h),
    // Repères des textes : sommet du dessus (titre), pied avant (année, précision).
    labelX: P(cx, cy, 0).x,
    topY: P(x0, y0, stage.h).y,
    baseY: P(x0 + SIDE, y0 + SIDE, 0).y,
  };
});

const GROUND = { from: P(-11.5, 11.5, 0), to: P(11.5, -11.5, 0) };
const CROSSES = [
  [70, 170],
  [1130, 150],
  [60, 440],
  [1150, 430],
] as const;

/** Un acte du texte : *mot* en bleu, [[mot]] en vert (le vert des cubes neufs). */
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

/**
 * Le récit de « Notre histoire » : le texte d'OPEM en trois actes, puis la frise dessinée.
 * Ordinateur : chaque acte est posé au-dessus de son pilier, relié à lui par un fil de
 * construction ; au défilement (GSAP ScrollTrigger), le récit reste figé à l'écran et se
 * construit acte par acte : le fil descend, l'acte s'allume, le pilier monte avec son titre et
 * son année, les cubes-domaines s'y posent (le sixième, en 2025, en vert), puis le réseau de
 * l'IA (2026) se trace. Tablette et téléphone : le texte d'un seul tenant (la liste des repères
 * suit). Sans script ou en mouvement réduit : tout est affiché, immobile.
 */
export function HistoryArt({
  text,
  milestones,
  rtl,
}: {
  text: CabinetContent['history']['text'];
  milestones: CabinetContent['history']['milestones'];
  rtl: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const story = ref.current;
    const svg = story?.querySelector('svg');
    if (!story || !svg || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia(story);
    media.add(
      {
        // Assez haut pour tenir à l'écran : le récit est figé le temps de sa construction.
        pin: '(min-width: 64em) and (min-height: 48em)',
        // Écran bas : pas de blocage, la construction suit simplement le défilement.
        flow: '(min-width: 64em) and (max-height: 47.99em)',
      },
      (context) => {
        const pin = Boolean(context.conditions?.pin);
        // Haut du récit figé : sous le menu et la barre des rubriques (scroll-margin-top du CSS).
        const top = () => parseFloat(getComputedStyle(story).scrollMarginTop) || 0;
        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: pin
            ? {
                trigger: story,
                start: () => `top ${top()}px`,
                end: '+=1600',
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
              }
            : { trigger: story, start: 'top 70%', end: 'bottom 45%', scrub: 0.6 },
        });
        timeline.from('[data-part="ground"]', { opacity: 0, duration: 0.6 });
        SCENE.forEach(({ index }) => {
          const q = (part: string) =>
            svg.querySelectorAll(`[data-stage="${index}"] [data-part="${part}"]`);
          timeline
            .fromTo(
              q('leader'),
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' },
            )
            .from(
              story.querySelector(`[data-act="${index}"]`),
              {
                opacity: 0.14,
                duration: 0.9,
                ease: 'none',
              },
              '<',
            )
            .from(q('pillar'), { y: 46, opacity: 0, duration: 1 }, '-=0.3')
            .from(q('text'), { opacity: 0, y: 10, duration: 0.6, stagger: 0.1 }, '-=0.5')
            .from(q('cube'), { y: -26, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
            .from(q('new'), { y: -40, opacity: 0, duration: 0.7, ease: 'bounce.out' })
            .fromTo(
              q('link'),
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 0.7, stagger: 0.05, ease: 'power1.inOut' },
            )
            .from(q('core'), { y: -34, opacity: 0, duration: 0.7, ease: 'back.out(2)' }, '-=0.3')
            .to({}, { duration: 0.6 }); // un temps de lecture avant l'acte suivant
        });
        // Pause sur le récit complet, le temps de le relire.
        timeline.to({}, { duration: 2 });
      },
    );

    return () => media.revert();
  }, [rtl]);

  // Arabe : la scène se lit de droite à gauche (dessin en miroir, textes à l'endroit).
  const mx = (x: number) => (rtl ? W - x : x);

  return (
    <div ref={ref} className={styles.story}>
      <p className={styles.text}>
        {text.map((act, index) => (
          <Fragment key={index}>
            {index > 0 && ' '}
            <span className={styles.act} data-act={index}>
              <Act text={act} />
            </span>
          </Fragment>
        ))}
      </p>

      <div className={styles.artFrame}>
        <svg
          className={styles.art}
          viewBox={`0 ${VIEW.y} ${W} ${VIEW.h}`}
          aria-hidden="true"
          focusable="false"
        >
          <g className={styles.artGuides}>
            {CROSSES.map(([x, y]) => (
              <path key={`${x}-${y}`} d={`M${mx(x) - 5} ${y}h10M${mx(x)} ${y - 5}v10`} />
            ))}
          </g>

          <g transform={rtl ? `translate(${W} 0) scale(-1 1)` : undefined}>
            <line
              className={styles.artGround}
              x1={GROUND.from.x}
              y1={GROUND.from.y}
              x2={GROUND.to.x}
              y2={GROUND.to.y}
              data-part="ground"
            />

            {SCENE.map((stage) => (
              <g key={stage.index} data-stage={stage.index}>
                <g data-part="pillar">
                  <polygon className={styles.artShadow} points={stage.shadow} />
                  <polygon className={styles.artLeft} points={stage.pillar.left} />
                  <polygon className={styles.artRight} points={stage.pillar.right} />
                  {stage.floors.map((floor) => (
                    <polyline key={floor} className={styles.artFloor} points={floor} />
                  ))}
                  <polygon className={styles.artTop} points={stage.pillar.top} />
                </g>

                {/* Réseau de l'IA, tracé sur le dessus, sous les cubes. */}
                {stage.core &&
                  stage.cubes.map((cube) => (
                    <line
                      key={`link-${cube.i}`}
                      className={styles.artLink}
                      x1={stage.center.x}
                      y1={stage.center.y}
                      x2={cube.foot.x}
                      y2={cube.foot.y}
                      pathLength={1}
                      data-part="link"
                    />
                  ))}

                {stage.cubes.map((cube) => (
                  <g
                    key={cube.i}
                    className={cube.isNew ? styles.artCubeNew : styles.artCube}
                    data-part={cube.isNew ? 'new' : 'cube'}
                  >
                    <polygon className={styles.cubeLeft} points={cube.faces.left} />
                    <polygon className={styles.cubeRight} points={cube.faces.right} />
                    <polygon className={styles.cubeTop} points={cube.faces.top} />
                  </g>
                ))}

                {stage.core && (
                  <g className={styles.artCubeCore} data-part="core">
                    <polygon className={styles.cubeLeft} points={stage.core.left} />
                    <polygon className={styles.cubeRight} points={stage.core.right} />
                    <polygon className={styles.cubeTop} points={stage.core.top} />
                  </g>
                )}
              </g>
            ))}
          </g>

          {/* Fils de construction (de l'acte au pilier) et textes, toujours à l'endroit : titre
              au-dessus du pilier, année et précision dessous. */}
          {SCENE.map((stage) => {
            const milestone = milestones[stage.index];
            if (!milestone) return null;
            const x = mx(stage.labelX);
            const leaderEnd = stage.topY - 64;
            return (
              <g key={milestone.year} data-stage={stage.index} className={styles.artText}>
                <line
                  className={styles.artLeader}
                  x1={x}
                  y1={VIEW.y}
                  x2={x}
                  y2={leaderEnd}
                  pathLength={1}
                  data-part="leader"
                />
                <circle
                  className={styles.artLeaderDot}
                  cx={x}
                  cy={leaderEnd}
                  r={3.5}
                  data-part="text"
                />
                <text className={styles.artTitle} x={x} y={stage.topY - 34} data-part="text">
                  {milestone.title}
                </text>
                <text
                  className={stage.index === LAST ? styles.artYearNow : styles.artYear}
                  x={x}
                  y={stage.baseY + 62}
                  data-part="text"
                >
                  {milestone.year}
                </text>
                <text className={styles.artDetail} x={x} y={stage.baseY + 90} data-part="text">
                  {milestone.text}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
