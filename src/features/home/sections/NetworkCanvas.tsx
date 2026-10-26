import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/hooks/prefersReducedMotion';

/*
 * Réseau 3D décoratif du bandeau d'accueil, dessiné à la main sur un <canvas>
 * (quelques Ko, aucune bibliothèque 3D). Couleurs de la charte sur bleu nuit :
 * liens en bleu 30 %, nœuds blancs, quelques touches d'ambre (≈ 1 nœud sur 10).
 * - S'arrête quand il n'est plus visible ou quand l'onglet est en arrière-plan.
 * - Image fixe si l'utilisateur demande moins d'animations.
 */

const POINTS = 110;
const NEIGHBOURS = 3;
const TURN_SPEED = 0.00011; // radians par milliseconde (un tour ≈ 1 minute)
const TILT = 0.38;

type Point = { x: number; y: number; z: number; amber: boolean };

// Générateur pseudo-aléatoire déterministe : le réseau est identique à chaque visite.
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildNetwork() {
  const rand = random(42);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: Point[] = Array.from({ length: POINTS }, (_, i) => {
    const y = 1 - (i / (POINTS - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const r = 1 + (rand() - 0.5) * 0.16;
    return {
      x: Math.cos(theta) * radius * r,
      y: y * r,
      z: Math.sin(theta) * radius * r,
      amber: i % 10 === 3,
    };
  });

  const edges = new Set<string>();
  points.forEach((p, i) => {
    points
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBOURS)
      .forEach(({ j }) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });

  return {
    points,
    edges: [...edges].map((key) => key.split('-').map(Number) as [number, number]),
  };
}

function getContext2d(canvas: HTMLCanvasElement | null) {
  try {
    return canvas?.getContext('2d') ?? null;
  } catch {
    return null; // environnement sans canvas (tests)
  }
}

export function NetworkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = getContext2d(canvas);
    if (!canvas || !ctx) return;

    const { points, edges } = buildNetwork();
    const projected = points.map(() => ({ x: 0, y: 0, depth: 0 }));
    const reduced = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let angle = 0.6;
    let frame = 0;
    let last = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.4;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);

      points.forEach((p, i) => {
        const x = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y = p.y * cosT - z1 * sinT;
        const z = p.y * sinT + z1 * cosT;
        const perspective = 2.4 / (2.4 - z);
        const target = projected[i]!;
        target.x = cx + x * radius * perspective;
        target.y = cy + y * radius * perspective;
        target.depth = (z + 1) / 2; // 0 = au fond, 1 = devant
      });

      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const pa = projected[a]!;
        const pb = projected[b]!;
        const depth = (pa.depth + pb.depth) / 2;
        ctx.strokeStyle = `rgba(178, 202, 222, ${0.08 + depth * 0.4})`; // bleu 30 %
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      points.forEach((p, i) => {
        const { x, y, depth } = projected[i]!;
        const alpha = 0.3 + depth * 0.7;
        ctx.fillStyle = p.amber
          ? `rgba(242, 178, 48, ${alpha})` // ambre
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, (p.amber ? 2.2 : 1.3) + depth * 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const tick = (now: number) => {
      if (last) angle += (now - last) * TURN_SPEED;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    });
    visibilityObserver.observe(canvas);

    const onVisibilityChange = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibilityChange);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
