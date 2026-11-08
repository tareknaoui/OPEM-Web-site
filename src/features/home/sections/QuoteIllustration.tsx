import { useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import styles from './QuoteOfMonth.module.css';

// Fichier généré par scripts/gen-rocher.py (géométrie isométrique calculée) : modifier le
// générateur plutôt que les nombres.
// Trajet du marcheur : [x, y, fraction du trajet], du départ au fanion.
const ROUTE: [number, number, number][] = [
  [105.5, 60.5, 0.0],
  [108.0, 61.9, 0.0099],
  [110.5, 63.4, 0.0198],
  [113.0, 64.8, 0.0297],
  [115.5, 66.3, 0.0396],
  [118.0, 67.7, 0.0495],
  [120.5, 69.2, 0.0594],
  [123.0, 70.6, 0.0693],
  [125.5, 72.1, 0.0792],
  [128.0, 73.5, 0.0892],
  [130.5, 74.9, 0.0991],
  [133.0, 76.4, 0.109],
  [135.5, 77.8, 0.1189],
  [138.0, 79.3, 0.1288],
  [140.5, 80.7, 0.1387],
  [143.0, 82.2, 0.1486],
  [145.5, 83.6, 0.1585],
  [148.0, 85.0, 0.1684],
  [150.5, 86.5, 0.1783],
  [153.0, 87.9, 0.1882],
  [155.5, 89.4, 0.1981],
  [158.0, 90.8, 0.208],
  [160.5, 92.3, 0.2179],
  [163.0, 93.7, 0.2278],
  [165.5, 95.1, 0.2377],
  [163.2, 96.5, 0.247],
  [161.1, 98.0, 0.2563],
  [159.1, 99.5, 0.2656],
  [157.2, 101.1, 0.2749],
  [155.5, 102.8, 0.2843],
  [154.0, 104.5, 0.2936],
  [152.6, 106.3, 0.303],
  [151.5, 108.1, 0.3124],
  [150.4, 109.9, 0.3218],
  [149.6, 111.8, 0.3313],
  [148.9, 113.8, 0.3408],
  [148.4, 115.7, 0.3504],
  [148.1, 117.7, 0.36],
  [148.0, 119.7, 0.3696],
  [148.0, 121.6, 0.3793],
  [148.3, 123.6, 0.389],
  [148.7, 125.6, 0.3987],
  [149.3, 127.6, 0.4085],
  [150.0, 129.6, 0.4183],
  [151.0, 131.6, 0.4282],
  [152.1, 133.5, 0.4381],
  [153.4, 135.4, 0.448],
  [154.8, 137.3, 0.458],
  [156.5, 139.1, 0.468],
  [158.2, 140.9, 0.478],
  [160.2, 142.7, 0.488],
  [162.2, 144.3, 0.4981],
  [164.4, 146.0, 0.5082],
  [166.8, 147.5, 0.5182],
  [169.3, 149.1, 0.5283],
  [171.9, 150.5, 0.5384],
  [174.6, 151.8, 0.5485],
  [177.4, 153.1, 0.5585],
  [180.4, 154.3, 0.5686],
  [183.4, 155.4, 0.5786],
  [186.5, 156.5, 0.5886],
  [189.7, 157.4, 0.5986],
  [192.9, 158.2, 0.6086],
  [196.2, 159.0, 0.6185],
  [199.6, 159.6, 0.6284],
  [203.0, 160.2, 0.6383],
  [206.4, 160.6, 0.6481],
  [209.8, 160.9, 0.6579],
  [213.3, 161.2, 0.6676],
  [216.7, 161.3, 0.6774],
  [220.2, 161.3, 0.687],
  [223.6, 161.3, 0.6967],
  [227.0, 161.1, 0.7062],
  [230.4, 160.8, 0.7158],
  [233.7, 160.4, 0.7253],
  [237.0, 159.9, 0.7348],
  [240.2, 159.3, 0.7442],
  [243.4, 158.7, 0.7536],
  [246.4, 157.9, 0.763],
  [249.4, 157.0, 0.7723],
  [252.3, 156.0, 0.7817],
  [255.0, 154.9, 0.791],
  [257.7, 153.8, 0.8003],
  [260.2, 152.6, 0.8096],
  [262.6, 151.2, 0.8189],
  [264.5, 152.3, 0.8264],
  [266.4, 153.4, 0.834],
  [268.4, 154.6, 0.8415],
  [270.3, 155.6, 0.849],
  [272.2, 156.8, 0.8566],
  [274.1, 157.9, 0.8641],
  [276.0, 158.9, 0.8717],
  [277.9, 160.1, 0.8792],
  [279.8, 161.1, 0.8868],
  [281.7, 162.2, 0.8943],
  [283.6, 163.4, 0.9019],
  [285.5, 164.4, 0.9094],
  [287.4, 165.6, 0.917],
  [289.3, 166.7, 0.9245],
  [291.2, 167.8, 0.9321],
  [293.1, 168.9, 0.9396],
  [295.0, 169.9, 0.9472],
  [296.9, 171.1, 0.9547],
  [298.8, 172.2, 0.9623],
  [300.7, 173.2, 0.9698],
  [302.6, 174.4, 0.9774],
  [304.6, 175.5, 0.9849],
  [306.5, 176.6, 0.9925],
  [308.4, 177.7, 1.0],
];

/** Position du marcheur sur le trajet (fraction 0 à 1), par interpolation entre deux points. */
function pointAt(t: number): [number, number] {
  const i = ROUTE.findIndex((p) => p[2] >= t);
  const from = ROUTE[i - 1];
  const to = ROUTE[i];
  if (!from || !to) return to ? [to[0], to[1]] : [0, 0];
  const [x0, y0, t0] = from;
  const [x1, y1, t1] = to;
  const k = (t - t0) / (t1 - t0 || 1);
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
}

/**
 * Le rocher contourné : un chemin isométrique barré par un rocher à facettes. Au défilement, le
 * marcheur le contourne, les dalles du détour apparaissent sous ses pas (le chemin naît de
 * l'obstacle), puis il rejoint le fanion ambre. Sans script ou en mouvement réduit : la scène
 * finale, détour pavé et marcheur au fanion. Décoratif (aria-hidden).
 */
export function QuoteIllustration() {
  const artRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<SVGGElement>(null);
  useScrollProgress(
    artRef,
    (progress, element) => {
      const t = prefersReducedMotion() ? 1 : progress;
      element.style.setProperty('--walk', t.toFixed(3));
      const [x, y] = pointAt(t);
      // Jambes et bras qui se balancent au rythme des pas ; immobile à l'arrivée.
      const swing = t >= 1 ? 0 : Math.sin(t * 34.4) * 24;
      walkerRef.current?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      walkerRef.current?.style.setProperty('--swing', `${swing.toFixed(1)}deg`);
    },
    { start: 0.9, end: 0.45 },
  );

  return (
    <div ref={artRef} className={styles.art} aria-hidden="true">
      <svg viewBox="0 0 400 262" width="400" height="262" focusable="false">
        {/* Lignes de construction */}
        <g className={styles.construction}>
          <line x1="38.8" y1="22.0" x2="88.3" y2="50.6" />
          <line x1="339.8" y1="195.8" x2="385.5" y2="222.2" />
          <path d="M11.0 67.1h6M14.0 64.1v6" />
          <path d="M207.2 50.6h6M210.2 47.6v6" />
          <path d="M340.6 132.0h6M343.6 129.0v6" />
          <path d="M331.1 229.9h6M334.1 226.9v6" />
          <path d="M172.9 202.4h6M175.9 199.4v6" />
        </g>
        {/* Plateau */}
        <polygon
          className={styles.slabLeft}
          points="14.0,93.5 265.5,238.7 265.5,247.9 14.0,102.7"
        />
        <polygon
          className={styles.slabRight}
          points="376.0,174.9 265.5,238.7 265.5,247.9 376.0,184.1"
        />
        <polygon className={styles.slabTop} points="124.5,29.7 376.0,174.9 265.5,238.7 14.0,93.5" />
        {/* Chemin principal, interrompu par le rocher */}
        <g className={styles.tile}>
          <polygon points="105.5,52.6 119.2,60.5 105.5,68.4 91.7,60.5" />
          <polygon points="123.6,63.0 137.3,71.0 123.6,78.9 109.8,71.0" />
          <polygon points="141.7,73.5 155.4,81.4 141.7,89.3 127.9,81.4" />
          <polygon points="159.8,83.9 173.5,91.9 159.8,99.8 146.0,91.9" />
          <polygon points="268.4,146.6 282.1,154.5 268.4,162.5 254.6,154.6" />
          <polygon points="286.5,157.1 300.2,165.0 286.5,172.9 272.7,165.0" />
          <polygon points="304.6,167.5 318.3,175.4 304.6,183.4 290.8,175.4" />
        </g>
        {/* Dalles du détour : chacune apparaît quand le marcheur l'atteint (--at) */}
        <g className={styles.tile}>
          <polygon
            className={styles.step}
            style={{ '--at': 0.303 } as CSSProperties}
            points="152.6,99.7 164.1,106.3 152.6,112.9 141.2,106.3"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.36 } as CSSProperties}
            points="148.1,111.1 159.5,117.7 148.1,124.3 136.7,117.7"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.418 } as CSSProperties}
            points="150.0,123.0 161.5,129.6 150.0,136.2 138.6,129.6"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.478 } as CSSProperties}
            points="158.2,134.3 169.7,140.9 158.2,147.5 146.8,140.9"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.528 } as CSSProperties}
            points="169.3,142.4 180.7,149.1 169.3,155.6 157.8,149.1"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.589 } as CSSProperties}
            points="186.5,149.9 197.9,156.5 186.5,163.1 175.1,156.5"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.648 } as CSSProperties}
            points="206.4,154.0 217.8,160.6 206.4,167.2 195.0,160.6"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.706 } as CSSProperties}
            points="227.0,154.5 238.5,161.1 227.0,167.7 215.6,161.1"
          />
          <polygon
            className={styles.step}
            style={{ '--at': 0.763 } as CSSProperties}
            points="246.4,151.3 257.9,157.9 246.4,164.5 235.0,157.9"
          />
        </g>
        {/* Rocher à facettes */}
        <g className={styles.rock}>
          <polygon fill="#7d91a6" points="198.4,91.9 196.3,86.8 200.1,84.2" />
          <polygon fill="#4b6783" points="198.4,91.9 200.1,84.2 207.3,93.7" />
          <polygon fill="#92a3b4" points="196.3,86.8 200.9,79.3 200.1,84.2" />
          <polygon fill="#183c60" points="212.1,84.9 214.1,89.0 208.2,80.2" />
          <polygon fill="#183c60" points="214.1,89.0 207.3,93.7 208.4,85.2" />
          <polygon fill="#1a3d61" points="214.1,89.0 208.4,85.2 208.2,80.2" />
          <polygon fill="#375675" points="207.3,93.7 204.0,78.9 208.4,85.2" />
          <polygon fill="#4a6682" points="207.3,93.7 200.1,84.2 204.0,78.9" />
          <polygon fill="#1b3e62" points="208.2,80.2 208.4,85.2 204.0,78.9" />
          <polygon fill="#99a9b9" points="200.1,84.2 200.9,79.3 204.0,78.9" />
          <polygon fill="#183c60" points="288.6,134.4 288.3,138.8 284.8,132.6" />
          <polygon fill="#234567" points="288.6,134.4 284.8,132.6 281.4,128.6" />
          <polygon fill="#193c60" points="288.3,138.8 279.4,140.5 280.3,135.0" />
          <polygon fill="#204365" points="288.3,138.8 280.3,135.0 284.8,132.6" />
          <polygon fill="#4e6a85" points="279.4,140.5 274.5,139.2 280.3,135.0" />
          <polygon fill="#8094a7" points="274.5,139.2 273.7,135.3 275.6,132.1" />
          <polygon fill="#758aa0" points="274.5,139.2 280.0,129.1 280.3,135.0" />
          <polygon fill="#7f92a6" points="274.5,139.2 275.6,132.1 280.0,129.1" />
          <polygon fill="#345373" points="284.8,132.6 280.3,135.0 280.0,129.1" />
          <polygon fill="#294a6b" points="284.8,132.6 280.0,129.1 281.4,128.6" />
          <polygon fill="#3d5b79" points="177.1,134.6 184.1,114.2 191.0,141.1" />
          <polygon fill="#788da2" points="177.1,134.6 181.2,97.8 184.1,114.2" />
          <polygon fill="#183c60" points="252.6,136.1 230.4,147.3 247.3,110.1" />
          <polygon fill="#183c60" points="252.6,136.1 247.3,110.1 251.2,90.5" />
          <polygon fill="#1e4164" points="230.4,147.3 191.0,141.1 219.6,124.0" />
          <polygon fill="#183c60" points="230.4,147.3 219.6,124.0 247.3,110.1" />
          <polygon fill="#325272" points="191.0,141.1 184.1,114.2 219.6,124.0" />
          <polygon fill="#57718b" points="219.6,124.0 184.1,114.2 198.5,92.7" />
          <polygon fill="#183c60" points="219.6,124.0 224.5,88.3 247.3,110.1" />
          <polygon fill="#57718b" points="219.6,124.0 198.5,92.7 224.5,88.3" />
          <polygon fill="#8ea0b1" points="184.1,114.2 181.2,97.8 196.2,69.9" />
          <polygon fill="#93a4b4" points="184.1,114.2 196.2,69.9 198.5,92.7" />
          <polygon fill="#183c60" points="251.2,90.5 247.3,110.1 235.1,76.6" />
          <polygon fill="#183c60" points="247.3,110.1 224.5,88.3 235.1,76.6" />
          <polygon fill="#3e5c7a" points="235.1,76.6 224.5,88.3 214.1,67.7" />
          <polygon fill="#405d7b" points="235.1,76.6 214.1,67.7 224.3,66.9" />
          <polygon fill="#688097" points="224.5,88.3 198.5,92.7 214.1,67.7" />
          <polygon fill="#95a6b6" points="198.5,92.7 196.2,69.9 214.1,67.7" />
        </g>
        {/* Fanion */}
        <line className={styles.pole} x1="322.7" y1="185.9" x2="322.7" y2="143.0" />
        <polygon className={styles.flag} points="322.7,143.0 339.8,158.8 322.7,155.1" />
        {/* Marcheur (pieds à l'origine), placé sur le trajet par le script */}
        <g ref={walkerRef} className={styles.walker} transform="translate(308.4 177.7)">
          <ellipse className={styles.walkerShadow} cx="0" cy="0" rx="6" ry="2.4" />
          <g transform="scale(1.3)">
            <path className={styles.legBack} d="M-0.9 -8.5V-0.6" />
            <path className={styles.legFront} d="M0.9 -8.5V-0.6" />
            <path className={styles.armBack} d="M-2.9 -14.6L-3.4 -9.2" />
            <rect x="-2.7" y="-16" width="5.4" height="8.6" rx="2" />
            <path className={styles.armFront} d="M2.9 -14.6L3.4 -9.2" />
            <circle cx="0" cy="-19.4" r="2.7" />
          </g>
        </g>
      </svg>
    </div>
  );
}
