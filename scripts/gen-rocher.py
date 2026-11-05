# Génère src/features/home/sections/QuoteIllustration.tsx : le rocher contourné, en isométrique.
# Usage : python scripts/gen-rocher.py, puis npm run lint.
import math, itertools, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'features', 'home', 'sections', 'QuoteIllustration.tsx')
S = 22.0
C30, S30 = math.cos(math.radians(30)), 0.5

NIGHT = (0x11, 0x36, 0x5B)
WHITE = (255, 255, 255)


def P(x, y, z=0.0):
    return ((x - y) * C30 * S, (x + y) * S30 * S - z * S)


def mix(a, b, t):
    return '#%02x%02x%02x' % tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# ---------- Scène (unités au sol) ----------
SX, SY, TH = 13.2, 5.8, 0.42      # plateau
PY = 1.9                          # axe du chemin
RC = (6.6, PY)                    # centre du rocher
ARC_R = 2.55                      # demi-largeur du détour (le long du chemin)
ARC_RY = 2.35                     # profondeur du détour
X0, X_END, FLAG_X = 0.9, 11.55, 12.3

pts2d = []                       # pour la boîte englobante


def poly(points3):
    pp = [P(*p) for p in points3]
    pts2d.extend(pp)
    return pp


def fmt(pp):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in pp)


def tile(cx, cy, h):
    return [(cx - h, cy - h, 0), (cx + h, cy - h, 0), (cx + h, cy + h, 0), (cx - h, cy + h, 0)]


# Plateau : dessus, face avant gauche (+y), face avant droite (+x)
slab_top = poly([(0, 0, 0), (SX, 0, 0), (SX, SY, 0), (0, SY, 0)])
slab_left = poly([(0, SY, 0), (SX, SY, 0), (SX, SY, -TH), (0, SY, -TH)])
slab_right = poly([(SX, 0, 0), (SX, SY, 0), (SX, SY, -TH), (SX, 0, -TH)])

# Lignes de construction : l'axe du chemin prolongé au-delà du plateau
axis_a = (P(-2.6, PY), P(0, PY))
axis_b = (P(SX, PY), P(SX + 2.4, PY))
pts2d.extend([axis_a[0], axis_b[1]])
crosses = [P(-1.2, 4.6), P(3.2, -1.3), P(10.4, -1.1), P(14.6, 3.6), P(9.2, 6.5)]
pts2d.extend(crosses)

# Dalles du chemin principal (interrompu par le rocher)
main_tiles = []
x = X0
while x < FLAG_X - 0.3:
    if abs(x - RC[0]) > ARC_R - 0.15:
        main_tiles.append(poly(tile(x, PY, 0.36)))
    x += 0.95

# Trajet du marcheur : tout droit, demi-tour devant le rocher (côté +y), puis tout droit.
route3 = []
xa, xb = RC[0] - ARC_R, RC[0] + ARC_R
n = 24
for i in range(n + 1):
    route3.append((X0 + (xa - X0) * i / n, PY))
for i in range(1, 61):
    th = math.pi - math.pi * i / 60
    route3.append((RC[0] + ARC_R * math.cos(th), PY + ARC_RY * math.sin(th)))
for i in range(1, n + 1):
    route3.append((xb + (X_END - xb) * i / n, PY))
lengths = [0.0]
for a, b in zip(route3, route3[1:]):
    lengths.append(lengths[-1] + math.dist(a, b))
TOTAL = lengths[-1]

# Dalles du détour : elles apparaissent au passage du marcheur
step_tiles = []
k = 0
arc_start, arc_end = lengths[n], lengths[n + 60]
for i in range(1, 10):
    target = arc_start + (arc_end - arc_start) * i / 10
    j = next(m for m, l in enumerate(lengths) if l >= target)
    cx, cy = route3[j]
    step_tiles.append((poly(tile(cx, cy, 0.3)), lengths[j] / TOTAL))

# Rocher : enveloppe convexe de points, faces visibles seulement, ombrées
import random


def boulder(cx, cy, r, h, seed, rings=((0, 1.0, 8), (0.42, 0.92, 7), (0.78, 0.55, 5))):
    rnd = random.Random(seed)
    pts = []
    for zf, rf, count in rings:
        off = rnd.uniform(0, 360)
        for i in range(count):
            a = math.radians(off + 360 * i / count + rnd.uniform(-14, 14))
            rr = r * rf * rnd.uniform(0.86, 1.08)
            pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a), h * zf * rnd.uniform(0.9, 1.1)))
    pts.append((cx + rnd.uniform(-0.1, 0.1) * r, cy + rnd.uniform(-0.1, 0.1) * r, h))
    return pts


cx, cy = RC
rock = boulder(cx, cy, 1.55, 2.55, 7)


def sub(a, b): return tuple(a[i] - b[i] for i in range(3))
def cross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def dot(a, b): return sum(a[i] * b[i] for i in range(3))
def norm(a):
    l = math.sqrt(dot(a, a)); return tuple(v / l for v in a)


def hull_faces(rock):
  faces = []
  for i, j, k2 in itertools.combinations(range(len(rock)), 3):
    a, b, c = rock[i], rock[j], rock[k2]
    nrm = cross(sub(b, a), sub(c, a))
    if dot(nrm, nrm) < 1e-9:
        continue
    side = [dot(nrm, sub(p, a)) for m, p in enumerate(rock) if m not in (i, j, k2)]
    if all(s <= 1e-9 for s in side):
        faces.append((a, b, c, norm(nrm)))
    elif all(s >= -1e-9 for s in side):
        faces.append((a, c, b, norm(tuple(-v for v in nrm))))
  out = []
  for a, b, c, nrm in faces:
    if dot(nrm, VIEW) <= 0.02 or nrm[2] < -0.5:
        continue
    t = max(dot(nrm, LIGHT), 0)
    out.append((poly([a, b, c]), mix(NIGHT, WHITE, 0.03 + 0.55 * t ** 1.3)))
  return out


VIEW = norm((1, 1, 1))
LIGHT = norm((-0.55, 0.45, 0.85))
# Cailloux d'abord (derrière le rocher), puis le rocher
pebbles = [boulder(4.75, 0.55, 0.36, 0.42, 3, ((0, 1, 6), (0.6, 0.6, 4))),
           boulder(8.95, 0.75, 0.3, 0.34, 5, ((0, 1, 6), (0.6, 0.6, 4))),
]
rock_faces = []
for pb in pebbles[:2]:
    rock_faces += hull_faces(pb)
rock_faces += hull_faces(rock)
front_faces = []

# Fanion : mât bleu nuit, drapeau ambre (seule touche ambre)
pole = (P(FLAG_X, PY, 0), P(FLAG_X, PY, 1.95))
flag = poly([(FLAG_X, PY, 1.95), (FLAG_X + 0.9, PY, 1.68), (FLAG_X, PY, 1.4)])
pts2d.extend(pole)

# Boîte englobante et décalage
mx = 14
minx = min(p[0] for p in pts2d) - mx
miny = min(p[1] for p in pts2d) - mx - 8
maxx = max(p[0] for p in pts2d) + mx
maxy = max(p[1] for p in pts2d) + mx


def sh(pp):
    return [(x - minx, y - miny) for x, y in pp]


W, H = maxx - minx, maxy - miny
route2 = [P(x, y) for x, y in route3]
route_js = ','.join(f'[{x - minx:.1f},{y - miny:.1f},{l / TOTAL:.4f}]' for (x, y), l in zip(route2, lengths))

lines = []
w = lines.append
w("import { useRef } from 'react';")
w("import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';")
w("import { useScrollProgress } from '@/hooks/useScrollProgress';")
w("import styles from './QuoteOfMonth.module.css';")
w("")
w("// Fichier généré par scripts/gen-rocher.py (géométrie isométrique calculée) : modifier le")
w("// générateur plutôt que les nombres.")
w("// Trajet du marcheur : [x, y, fraction du trajet], du départ au fanion.")
w(f"const ROUTE: [number, number, number][] = [{route_js}];")
w("")
w("/** Position du marcheur sur le trajet (fraction 0 à 1), par interpolation entre deux points. */")
w("function pointAt(t: number): [number, number] {")
w("  const i = ROUTE.findIndex((p) => p[2] >= t);")
w("  const from = ROUTE[i - 1];")
w("  const to = ROUTE[i];")
w("  if (!from || !to) return to ? [to[0], to[1]] : [0, 0];")
w("  const [x0, y0, t0] = from;")
w("  const [x1, y1, t1] = to;")
w("  const k = (t - t0) / (t1 - t0 || 1);")
w("  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];")
w("}")
w("")
w("/**")
w(" * Le rocher contourné : un chemin isométrique barré par un rocher à facettes. Au défilement, le")
w(" * marcheur le contourne, les dalles du détour apparaissent sous ses pas (le chemin naît de")
w(" * l'obstacle), puis il rejoint le fanion ambre. Sans script ou en mouvement réduit : la scène")
w(" * finale, détour pavé et marcheur au fanion. Décoratif (aria-hidden).")
w(" */")
w("export function QuoteIllustration() {")
w("  const artRef = useRef<HTMLDivElement>(null);")
w("  const walkerRef = useRef<SVGGElement>(null);")
w("  useScrollProgress(")
w("    artRef,")
w("    (progress, element) => {")
w("      const t = prefersReducedMotion() ? 1 : progress;")
w("      element.style.setProperty('--walk', t.toFixed(3));")
w("      const [x, y] = pointAt(t);")
w("      // Jambes et bras qui se balancent au rythme des pas ; immobile à l'arrivée.")
w(f"      const swing = t >= 1 ? 0 : Math.sin(t * {TOTAL * 2.6:.1f}) * 24;")
w("      walkerRef.current?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);")
w("      walkerRef.current?.style.setProperty('--swing', `${swing.toFixed(1)}deg`);")
w("    },")
w("    { start: 0.9, end: 0.45 },")
w("  );")
w("")
end = sh([route2[-1]])[0]
w("  return (")
w("    <div ref={artRef} className={styles.art} aria-hidden=\"true\">")
w(f"      <svg viewBox=\"0 0 {W:.0f} {H:.0f}\" width=\"{W:.0f}\" height=\"{H:.0f}\" focusable=\"false\">")
w("        {/* Lignes de construction */}")
w("        <g className={styles.construction}>")
for a, b in (axis_a, axis_b):
    (x1, y1), (x2, y2) = sh([a, b])
    w(f"          <line x1=\"{x1:.1f}\" y1=\"{y1:.1f}\" x2=\"{x2:.1f}\" y2=\"{y2:.1f}\" />")
for (x0, y0) in sh(crosses):
    w(f"          <path d=\"M{x0 - 3:.1f} {y0:.1f}h6M{x0:.1f} {y0 - 3:.1f}v6\" />")
w("        </g>")
w("        {/* Plateau */}")
w(f"        <polygon className={{styles.slabLeft}} points=\"{fmt(sh(slab_left))}\" />")
w(f"        <polygon className={{styles.slabRight}} points=\"{fmt(sh(slab_right))}\" />")
w(f"        <polygon className={{styles.slabTop}} points=\"{fmt(sh(slab_top))}\" />")
w("        {/* Chemin principal, interrompu par le rocher */}")
w("        <g className={styles.tile}>")
for t in main_tiles:
    w(f"          <polygon points=\"{fmt(sh(t))}\" />")
w("        </g>")
w("        {/* Dalles du détour : chacune apparaît quand le marcheur l'atteint (--at) */}")
w("        <g className={styles.tile}>")
for t, at in step_tiles:
    w(f"          <polygon className={{styles.step}} style={{{{ '--at': {at:.3f} }} as React.CSSProperties}} points=\"{fmt(sh(t))}\" />")
w("        </g>")
w("        {/* Rocher à facettes */}")
w("        <g className={styles.rock}>")
for pp, col in rock_faces:
    w(f"          <polygon fill=\"{col}\" points=\"{fmt(sh(pp))}\" />")
w("        </g>")
w("        {/* Fanion */}")
(px1, py1), (px2, py2) = sh(list(pole))
w(f"        <line className={{styles.pole}} x1=\"{px1:.1f}\" y1=\"{py1:.1f}\" x2=\"{px2:.1f}\" y2=\"{py2:.1f}\" />")
w(f"        <polygon className={{styles.flag}} points=\"{fmt(sh(flag))}\" />")
w("        {/* Marcheur (pieds à l'origine), placé sur le trajet par le script */}")
w(f"        <g ref={{walkerRef}} className={{styles.walker}} transform=\"translate({end[0]:.1f} {end[1]:.1f})\">")
w("          <ellipse className={styles.walkerShadow} cx=\"0\" cy=\"0\" rx=\"6\" ry=\"2.4\" />")
w("          <g transform=\"scale(1.3)\">")
w("          <path className={styles.legBack} d=\"M-0.9 -8.5V-0.6\" />")
w("          <path className={styles.legFront} d=\"M0.9 -8.5V-0.6\" />")
w("          <path className={styles.armBack} d=\"M-2.9 -14.6L-3.4 -9.2\" />")
w("          <rect x=\"-2.7\" y=\"-16\" width=\"5.4\" height=\"8.6\" rx=\"2\" />")
w("          <path className={styles.armFront} d=\"M2.9 -14.6L3.4 -9.2\" />")
w("          <circle cx=\"0\" cy=\"-19.4\" r=\"2.7\" />")
w("          </g>")
w("        </g>")
w("      </svg>")
w("    </div>")
w("  );")
w("}")
src = '\n'.join(lines) + '\n'
src = src.replace("import { useRef } from 'react';", "import { useRef, type CSSProperties } from 'react';").replace('as React.CSSProperties', 'as CSSProperties')
open(OUT, 'w', encoding='utf-8', newline='\n').write(src)
print('ok', round(W), round(H), len(rock_faces), 'faces', round(TOTAL, 2))
