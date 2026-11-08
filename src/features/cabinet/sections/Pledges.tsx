import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Fragment, useEffect, useRef } from 'react';
import type { CabinetContent } from '../content';
import { motionAllowed } from '../useCabinetMotion';
import styles from './Pledges.module.css';

/**
 * 06 « Nos engagements », le seul bloc foncé de la page (bleu nuit) : un serment, sans image.
 * Surtitre en bleu 30 % précédé d'un filet ambre, titre en blanc, puis le paragraphe d'un seul
 * tenant, en grand ; les cinq destinataires (« À nos clients, »…) en ambre et en gras, sans
 * couper la phrase ; un filet ambre conclut.
 * Au défilement (GSAP, SplitText) : sur un écran assez haut, le bloc reste figé plein écran
 * pendant que le serment s'écrit mot par mot ; chaque destinataire prend l'ambre quand la lecture
 * l'atteint, puis le filet se trace. Écran très bas : même lecture, sans blocage. Sans script ou en
 * mouvement réduit : le serment complet, immobile. Ordinateur et tablette : centré ;
 * téléphone : aligné à gauche.
 */
export function Pledges({ pledges }: { pledges: CabinetContent['pledges'] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    const text = section?.querySelector<HTMLElement>('[data-pledge]');
    const rule = section?.querySelector('[data-rule]');
    if (!section || !text || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const media = gsap.matchMedia(section);
    media.add(
      {
        pin: '(min-height: 36em)',
        flow: '(max-height: 35.99em)',
      },
      (context) => {
        const pin = Boolean(context.conditions?.pin);
        const split = SplitText.create(text, { type: 'words' });
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: pin
            ? {
                trigger: section,
                start: 'top top',
                end: '+=110%',
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
              }
            : { trigger: text, start: 'top 92%', end: 'top 50%', scrub: 0.4 },
        });
        split.words.forEach((word, index) => {
          const at = index * 0.2;
          timeline.fromTo(word, { opacity: 0.3 }, { opacity: 1, duration: 1 }, at);
          const recipient = word.closest('strong');
          if (recipient) {
            const amber = getComputedStyle(recipient).color;
            timeline.fromTo(word, { color: '#ffffff' }, { color: amber, duration: 1.2 }, at + 0.4);
          }
        });
        timeline.fromTo(
          rule ?? [],
          { scaleX: 0 },
          { scaleX: 1, duration: 2.5, ease: 'power2.out' },
        );
        // Un temps sur le serment complet avant que la page reprenne.
        if (pin) timeline.to({}, { duration: 4 });
        return () => split.revert();
      },
    );
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="nos-engagements">
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>{pledges.eyebrow}</p>
        <h2 id="nos-engagements" className={styles.title} data-motion="title">
          {pledges.title}
        </h2>
        <p className={styles.text} data-pledge>
          {pledges.text.split(/(\*[^*]+\*)/).map((part, index) =>
            part.startsWith('*') ? (
              <strong key={index} className={styles.recipient}>
                {part.slice(1, -1)}
              </strong>
            ) : (
              <Fragment key={index}>{part}</Fragment>
            ),
          )}
        </p>
        <span className={styles.rule} data-rule aria-hidden="true" />
      </div>
    </section>
  );
}
