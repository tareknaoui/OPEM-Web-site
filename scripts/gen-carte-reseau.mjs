// Génère src/features/cabinet/sections/networkMap.ts : la carte en points du bloc 07
// « Notre réseau d'experts » (terres d'Europe, d'Afrique du Nord et du Moyen-Orient ; l'Algérie à
// part ; l'équipe, l'arc et le point au-delà des frontières). Lancer : node scripts/gen-carte-reseau.mjs
// dotted-map (MIT, dépendance de développement) ne sert qu'ici : le site n'embarque que les points.
import { writeFileSync } from 'node:fs';
import DottedMap from 'dotted-map';

/** Les sept membres de l'équipe (décalages en unités de grille depuis le centre). */
const MEMBERS = [
  [0, 0],
  [-3, -1.2],
  [-0.8, -3.1],
  [2.3, -2.4],
  [3.3, 0.4],
  [1.3, 2.8],
  [-2, 2.4],
];

const LAYOUTS = {
  // Ordinateur et tablette : de l'Atlantique au Golfe, de la Scandinavie du Sud au Sahel.
  wide: {
    width: 96,
    region: { lat: { min: 19, max: 48 }, lng: { min: -17, max: 45 } },
    team: { lat: 30.5, lng: 2.5, spread: 1 },
    beyond: { lat: 45.6, lng: 5.2 },
    lift: 0.32,
  },
  // Téléphone : l'Algérie et l'Europe de l'Ouest, en hauteur.
  narrow: {
    width: 46,
    region: { lat: { min: 18, max: 49 }, lng: { min: -10, max: 18 } },
    team: { lat: 30, lng: 2.8, spread: 0.85 },
    beyond: { lat: 45.6, lng: 5.2 },
    lift: 0.3,
  },
};

/** Les points d'une couche, en un seul tracé : un trait de longueur nulle par point. */
const toPath = (points) =>
  points.map(({ x, y }) => `M${+x.toFixed(1)} ${+y.toFixed(1)}h0`).join('');

const round = (n) => +n.toFixed(2);
const out = {};

for (const [name, layout] of Object.entries(LAYOUTS)) {
  const options = { width: layout.width, region: layout.region, grid: 'diagonal' };
  const land = new DottedMap(options);
  const home = new DottedMap({ ...options, countries: ['DZA'] });

  // Position à l'écran d'un lieu : on pose une épingle et on relit le point.
  const at = (lat, lng) => {
    land.addPin({ lat, lng, data: `${lat},${lng}` });
    const pin = land.getPoints().find((p) => p.data === `${lat},${lng}`);
    return [round(pin.x), round(pin.y)];
  };
  const homeKeys = new Set(home.getPoints().map((p) => `${p.x}|${p.y}`));
  const points = new DottedMap(options).getPoints();
  const w = Math.ceil(Math.max(...points.map((p) => p.x)) + 1);
  const h = Math.ceil(Math.max(...points.map((p) => p.y)) + 1);

  const [cx, cy] = at(layout.team.lat, layout.team.lng);
  const team = MEMBERS.map(([dx, dy]) => [
    round(cx + dx * layout.team.spread),
    round(cy + dy * layout.team.spread),
  ]);
  const beyond = at(layout.beyond.lat, layout.beyond.lng);
  // L'arc part du membre le plus au nord-est et s'incurve vers l'est avant d'atteindre le point.
  const [sx, sy] = team[3];
  const [ex, ey] = beyond;
  const length = Math.hypot(ex - sx, ey - sy);
  const [nx, ny] = [-(ey - sy) / length, (ex - sx) / length];
  const side = nx >= 0 ? 1 : -1;
  const qx = (sx + ex) / 2 + side * nx * length * layout.lift;
  const qy = (sy + ey) / 2 + side * ny * length * layout.lift;
  const arc = `M${round(sx)} ${round(sy)}Q${round(qx)} ${round(qy)} ${ex} ${ey}`;
  // Points de départ des membres : sept points du vivier, hors d'Algérie, tout autour.
  const pool = points.filter((p) => !homeKeys.has(`${p.x}|${p.y}`));
  const starts = MEMBERS.map((_, i) => {
    const angle = (i / MEMBERS.length) * Math.PI * 2 + 0.6;
    const target = [cx + Math.cos(angle) * w * 0.26, cy + Math.sin(angle) * h * 0.3];
    const best = pool.reduce((a, b) =>
      Math.hypot(b.x - target[0], b.y - target[1]) < Math.hypot(a.x - target[0], a.y - target[1])
        ? b
        : a,
    );
    return [round(best.x), round(best.y)];
  });

  out[name] = {
    w,
    h,
    land: toPath(points.filter((p) => !homeKeys.has(`${p.x}|${p.y}`))),
    home: toPath(points.filter((p) => homeKeys.has(`${p.x}|${p.y}`))),
    team,
    beyond,
    arc,
    starts,
    count: points.length,
  };
  console.log(name, `${w}×${h}`, points.length, 'points', homeKeys.size, 'en Algérie');
}

const file = `// Fichier généré par scripts/gen-carte-reseau.mjs (dotted-map, terres de johan/world.geo.json) :
// modifier le générateur plutôt que les nombres.

export type NetworkMap = {
  /** Dimensions de la grille (viewBox). */
  w: number;
  h: number;
  /** Les terres hors d'Algérie (le vivier), puis l'Algérie, chacune en un seul tracé. */
  land: string;
  home: string;
  /** Les sept membres de l'équipe, le point au-delà des frontières, l'arc qui y mène. */
  team: [number, number][];
  /** D'où partent les membres à l'animation : sept points du vivier. */
  starts: [number, number][];
  beyond: [number, number];
  arc: string;
};

export const NETWORK_MAPS: Record<'wide' | 'narrow', NetworkMap> = {
${Object.entries(out)
  .map(
    ([name, m]) => `  ${name}: {
    w: ${m.w},
    h: ${m.h},
    land: '${m.land}',
    home: '${m.home}',
    team: ${JSON.stringify(m.team)},
    starts: ${JSON.stringify(m.starts)},
    beyond: ${JSON.stringify(m.beyond)},
    arc: '${m.arc}',
  },`,
  )
  .join('\n')}
};
`;
writeFileSync('src/features/cabinet/sections/networkMap.ts', file);
console.log('écrit', Math.round(file.length / 1024), 'Ko');
