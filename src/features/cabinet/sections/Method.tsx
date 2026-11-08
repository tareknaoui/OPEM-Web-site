import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import type { CabinetContent } from '../content';
import { STEP_ICONS } from '../icons';
import { fitToScreen, motionAllowed, PANEL_QUERY, panelPin, panelRoom } from '../useCabinetMotion';
import styles from './Method.module.css';

/**
 * 04 « Travailler avec OPEM » (ancre #travailler-avec-opem, visée par la FAQ de l'accueil), sur
 * blanc : surtitre et titre, puis les quatre temps en parcours. Un fil numéroté les relie
 * (01 → 04) ; chaque temps est une carte : son icône, le verbe, le texte, puis l'engagement en
 * pied de carte sur bleu nuit, pour que les quatre promesses se lisent d'un coup d'œil.
 * Au défilement (GSAP) : sur un écran assez grand, la section se fige, le fil se trace au rythme
 * de la molette et chaque carte s'allume quand il l'atteint ; ailleurs, chaque temps se pose à
 * son arrivée. Ordinateur :
 * quatre colonnes alignées ; tablette : deux par deux ; téléphone : empilés dans l'ordre.
 */
export function Method({ method }: { method: CabinetContent['method'] }) {
  const ref = useRef<HTMLElement>(null);
  const last = method.steps.length - 1;

  useEffect(() => {
    const section = ref.current;
    const list = section?.querySelector('ol');
    if (!section || !list || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(section);
    const parts = () =>
      Array.from(list.children, (step) => ({
        step,
        line: step.querySelector('[data-line]'),
        card: step.querySelector('[data-card]'),
        icon: step.querySelector('[data-icon]'),
      }));

    // Écran assez grand : la section se fige ; le fil se trace et allume les cartes une à une.
    media.add(PANEL_QUERY, () => {
      const unfit =
        section.firstElementChild instanceof HTMLElement
          ? fitToScreen(section.firstElementChild, panelRoom(section))
          : undefined;
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: panelPin(section, 100),
      });
      parts().forEach(({ line, card, icon }) => {
        timeline
          .from(card, { opacity: 0.2, y: 36, duration: 0.7, ease: 'power2.out' })
          .from(icon, { scale: 0.5, rotate: -20, duration: 0.5, ease: 'back.out(2)' }, '<0.2')
          .from(line, { scaleX: 0, duration: 1 }, '<');
      });
      timeline.to({}, { duration: 1 }); // un temps sur les quatre engagements
      return unfit;
    });

    // Ailleurs : chaque temps se pose à son arrivée.
    media.add(`not all and ${PANEL_QUERY}`, () => {
      parts().forEach(({ step, line, card, icon }) => {
        gsap
          .timeline({ scrollTrigger: { trigger: step, start: 'top 95%', once: true } })
          .from(line, { scaleX: 0, duration: 0.9, ease: 'power2.inOut' })
          .from(card, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '<0.1')
          .from(icon, { scale: 0.5, duration: 0.6, ease: 'back.out(2)' }, '<0.3');
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="travailler-avec-opem" data-panel>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {method.eyebrow}
          </p>
          <h2 id="travailler-avec-opem" className={styles.title} data-motion="title">
            {method.title}
          </h2>
        </div>

        <ol className={styles.steps}>
          {method.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <li key={step.verb} className={styles.step}>
                <div className={styles.marker} aria-hidden="true">
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={index === last ? styles.lineEnd : styles.line} data-line />
                </div>
                <div className={styles.card} data-card>
                  <h3 className={styles.verb}>
                    {Icon && (
                      <span className={styles.icon} data-icon aria-hidden="true">
                        <Icon size={26} weight="duotone" />
                      </span>
                    )}
                    {step.verb}
                  </h3>
                  <p className={styles.text}>{step.text}</p>
                  <p className={styles.promise}>
                    <span className={styles.promiseLabel}>{method.promiseLabel}</span>{' '}
                    <strong className={styles.promiseText}>{step.promise}</strong>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
