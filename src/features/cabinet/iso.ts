/*
 * Projection isométrique commune aux illustrations de la page « Le cabinet » (même projection que
 * les illustrations du site) : x part vers la droite et le bas, y vers la gauche et le bas, z monte.
 * Faces visibles d'une boîte : le dessus, la face gauche (côté +y) et la face droite (côté +x).
 */

export type Point = { x: number; y: number };

const C = Math.cos(Math.PI / 6);

/** Liste de points au format de l'attribut SVG « points ». */
export const pts = (list: Point[]) =>
  list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

/** Une projection : origine à l'écran et pixels par unité. */
export function iso(origin: Point, scale: number) {
  const P = (x: number, y: number, z: number): Point => ({
    x: origin.x + (x - y) * C * scale,
    y: origin.y + (x + y) * 0.5 * scale - z * scale,
  });

  /** Boîte (a selon x, b selon y, h de haut) : ses trois faces visibles. */
  const box = (x0: number, y0: number, z0: number, a: number, b: number, h: number) => {
    const [x1, y1, z1] = [x0 + a, y0 + b, z0 + h];
    return {
      top: pts([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]),
      left: pts([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]),
      right: pts([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)]),
    };
  };

  /** Polygone ou ligne brisée à partir de points 3D. */
  const poly = (...list: [number, number, number][]) => pts(list.map(([x, y, z]) => P(x, y, z)));

  return { P, box, poly };
}
