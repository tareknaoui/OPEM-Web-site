import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { motionAllowed } from '@/features/cabinet/useCabinetMotion';
import styles from './ExpertisesPage.module.css';

/*
 * Bloc 05, « Du flou au cap », joué une fois (environ 3,5 s) quand le dessin est
 * bien à l'écran (GSAP ScrollTrigger) :
 * 1. trois fils emmêlés (décision, transformation, compétences : « tout se présente à la fois »)
 *    se tracent, puis se démêlent (MorphSVG) et convergent en une seule ligne ;
 * 2. la ligne se prolonge et un point vert, le premier pas, la parcourt ;
 * 3. une boussole se dessine autour de lui : son aiguille hésite puis se fixe sur le cap, et un
 *    halo bat doucement une fois l'animation terminée.
 * Le dessin du balisage est l'état final : c'est lui qu'on voit sans script, dans les tests et
 * si moins d'animations est demandé. Couleurs sur fond clair (bleu nuit, bleu OPEM, vert) ; pas
 * d'ambre.
 */

/** Les fils emmêlés, de départ (l'animation part d'eux). */
const KNOTS = [
  'M 40 156 C 90 100, 170 120, 150 180 C 132 236, 60 210, 92 168 C 124 126, 210 150, 196 210 C 186 250, 120 250, 140 214 C 160 180, 220 196, 240 200',
  'M 40 200 C 70 260, 150 270, 168 222 C 186 172, 110 130, 96 186 C 84 236, 178 250, 200 196 C 216 156, 160 120, 140 150 C 122 178, 200 214, 240 200',
  'M 40 244 C 60 300, 130 290, 120 246 C 110 200, 60 150, 110 140 C 160 130, 220 170, 186 230 C 160 276, 110 230, 150 196 C 176 176, 216 196, 240 200',
];

/** Les mêmes fils démêlés, qui convergent vers la ligne (état final). */
const STRANDS = [
  'M 40 156 C 120 156, 160 200, 240 200',
  'M 40 200 C 120 200, 160 200, 240 200',
  'M 40 244 C 120 244, 160 200, 240 200',
];

const STRAND_CLASSES = [styles.strandNight, styles.strandBlue, styles.strandGreen];
const CENTER = { x: 470, y: 200 };
const TICKS = [0, 90, 180, 270];

export function ThreadArt({
  marks,
  alt,
}: {
  marks: { situation: string; step: string; course: string };
  alt: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin);
    const q = gsap.utils.selector(svg);

    const ctx = gsap.context(() => {
      const strands = q('[data-strand]');
      const line = q('[data-line]');
      const rings = q('[data-ring]');
      // Ligne et cercles masqués avant leur tracé (sinon leurs bouts arrondis font des points).
      gsap.set([line, rings], { autoAlpha: 0 });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        paused: true,
        onComplete: () => svg.setAttribute('data-done', ''),
      });
      // Départ quand le dessin est entièrement visible (ou presque, sur un petit écran).
      ScrollTrigger.create({
        trigger: svg,
        start: 'bottom 90%',
        once: true,
        // Accéléré : environ 3,5 s en tout.
        onEnter: () => timeline.timeScale(2.6).play(),
      });

      // 1. Les fils emmêlés se tracent, puis se démêlent et convergent.
      timeline
        .fromTo(
          strands,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 1.6, stagger: 0.2, ease: 'power1.inOut' },
        )
        .fromTo(
          q('[data-mark="situation"]'),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          0.5,
        )
        .from(
          strands,
          {
            morphSVG: (index: number) => KNOTS[index] ?? '',
            duration: 2,
            stagger: 0.12,
            ease: 'power2.inOut',
            immediateRender: true,
          },
          '+=1', // un temps pour voir le fouillis avant qu'il se démêle
        )
        .to(q('[data-mark="situation"]'), { opacity: 0.45, duration: 0.6 }, '<0.6');

      // 2. La ligne se prolonge ; le premier pas la parcourt.
      timeline
        .set(line, { autoAlpha: 1 })
        .fromTo(line, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'power1.inOut' })
        .fromTo(
          q('[data-step]'),
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.3, ease: 'back.out(3)' },
          '<',
        )
        .fromTo(q('[data-step]'), { x: -230 }, { x: 0, duration: 2.2, ease: 'power2.inOut' }, '<')
        .fromTo(
          q('[data-mark="step"]'),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          '<0.1',
        );

      // 3. La boussole se dessine ; l'aiguille hésite puis trouve le cap.
      timeline
        .set(rings, { autoAlpha: 1 }, '-=0.7')
        .fromTo(
          rings,
          { drawSVG: '50% 50%' },
          { drawSVG: '0% 100%', duration: 0.9, stagger: 0.15 },
          '<',
        )
        .fromTo(
          q('[data-disc]'),
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.6, ease: 'power2.out' },
          '<',
        )
        .fromTo(
          q('[data-tick]'),
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.3, stagger: 0.06, ease: 'back.out(2)' },
          '<0.3',
        )
        .fromTo(
          q('[data-needle]'),
          { rotation: -220, svgOrigin: `${CENTER.x} ${CENTER.y}`, opacity: 0 },
          {
            rotation: 0,
            svgOrigin: `${CENTER.x} ${CENTER.y}`,
            opacity: 1,
            duration: 2,
            ease: 'elastic.out(1, 0.45)',
          },
          '<',
        )
        .fromTo(
          q('[data-mark="course"]'),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          '<0.4',
        )
        .to({}, { duration: 0.5 }); // un temps sur l'image finale
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} className={styles.thread} viewBox="0 0 560 340" role="img" aria-label={alt}>
      {/* Halo de la boussole (bat doucement une fois l'animation terminée). */}
      <circle cx={CENTER.x} cy={CENTER.y} r="46" className={styles.threadHalo} />

      {STRANDS.map((d, index) => (
        <path key={d} d={d} data-strand="" className={STRAND_CLASSES[index]} />
      ))}
      <path d="M 240 200 L 424 200" data-line="" className={styles.threadLine} />

      <g className={styles.compass}>
        <circle cx={CENTER.x} cy={CENTER.y} r="45" data-disc="" className={styles.compassDisc} />
        <circle cx={CENTER.x} cy={CENTER.y} r="46" data-ring="" className={styles.compassRing} />
        <circle cx={CENTER.x} cy={CENTER.y} r="32" data-ring="" className={styles.compassInner} />
        {TICKS.map((angle) => (
          <line
            key={angle}
            x1={CENTER.x}
            y1={CENTER.y - 46}
            x2={CENTER.x}
            y2={CENTER.y - 38}
            transform={`rotate(${angle} ${CENTER.x} ${CENTER.y})`}
            data-tick=""
            className={styles.compassTick}
          />
        ))}
        <g data-needle="">
          <path d="M 470 193 L 504 200 L 470 207 Z" className={styles.needleHead} />
          <path d="M 470 193 L 436 200 L 470 207 Z" className={styles.needleTail} />
        </g>
      </g>

      <circle cx={CENTER.x} cy={CENTER.y} r="9" data-step="" className={styles.threadStep} />

      <g className={styles.threadMarks} aria-hidden="true">
        <text x="130" y="318" textAnchor="middle" data-mark="situation">
          {marks.situation}
        </text>
        <text x="320" y="176" textAnchor="middle" data-mark="step">
          {marks.step}
        </text>
        <text x={CENTER.x} y="284" textAnchor="middle" data-mark="course">
          {marks.course}
        </text>
      </g>
    </svg>
  );
}
