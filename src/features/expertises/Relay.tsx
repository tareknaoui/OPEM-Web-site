import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { GraduationCapIcon } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { MegaphoneIcon } from '@phosphor-icons/react/dist/csr/Megaphone';
import { SealCheckIcon } from '@phosphor-icons/react/dist/csr/SealCheck';
import { TreeStructureIcon } from '@phosphor-icons/react/dist/csr/TreeStructure';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, type RefObject } from 'react';
import {
  fitToScreen,
  motionAllowed,
  PANEL_QUERY,
  panelPin,
  panelRoom,
} from '@/features/cabinet/useCabinetMotion';
import styles from './Relay.module.css';

/** Les cinq métiers du cas client, dans l'ordre du texte : leur photo et leur icône (celles
 *  du bloc 01). Photos Pexels, recadrées en 4:3 (public/images/expertises). */
const STEPS = [
  { photo: '/images/expertises/relais-accompagnement', Icon: TreeStructureIcon },
  { photo: '/images/expertises/relais-formation', Icon: GraduationCapIcon },
  { photo: '/images/expertises/relais-coaching', Icon: CompassIcon },
  { photo: '/images/expertises/relais-communication', Icon: MegaphoneIcon },
  { photo: '/images/expertises/relais-certification', Icon: SealCheckIcon },
];

const LAST = STEPS.length - 1;
const HIDDEN = 'inset(0% 0% 0% 100%)';
const HIDDEN_RTL = 'inset(0% 100% 0% 0%)';
const SHOWN = 'inset(0% 0% 0% 0%)';

/**
 * Bloc 03, « Les métiers se relaient » : cinq vraies photos, une par métier, se succèdent
 * dans un même cadre, chacune balayant la précédente comme on passe le témoin ; dessous, le fil
 * du relais allume les cinq métiers l'un après l'autre.
 * Ordinateur (écran assez grand) : la section se fige et le relais avance au rythme de la
 * molette. Ailleurs : il se joue seul, une fois, à l'arrivée du cadre. Les chiffres du texte
 * (+30, +150) comptent jusqu'à leur valeur. Sans script ou en mouvement réduit : la dernière
 * photo et les cinq métiers allumés, immobiles.
 */
export function Relay({
  lanes,
  alt,
  rtl,
  sectionRef,
}: {
  lanes: string[];
  alt: string;
  rtl: boolean;
  /** La section entière : c'est elle qui se fige sur ordinateur. */
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const figure = ref.current;
    const section = sectionRef.current;
    if (!figure || !section) return;
    const steps = Array.from(figure.querySelectorAll<HTMLElement>('[data-step]'));
    const activate = (index: number) =>
      steps.forEach((step, i) => step.toggleAttribute('data-active', i <= index));
    if (!motionAllowed()) {
      activate(LAST);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const photos = Array.from(figure.querySelectorAll<HTMLElement>('[data-photo]'));
    const fill = figure.querySelector('[data-fill]');
    const media = gsap.matchMedia(section);

    // Le relais : chaque photo balaie la précédente, le fil avance d'un métier.
    const relay = (timeline: gsap.core.Timeline) => {
      photos.slice(1).forEach((photo, i) => {
        const image = photo.querySelector('img');
        timeline
          .fromTo(
            photo,
            { clipPath: rtl ? HIDDEN_RTL : HIDDEN },
            { clipPath: SHOWN, duration: 1, ease: 'power2.inOut' },
          )
          .fromTo(image, { scale: 1.18 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
          .to(fill, { scaleX: (i + 1) / LAST, duration: 1, ease: 'power2.inOut' }, '<');
      });
      return timeline;
    };

    // Les chiffres comptent jusqu'à leur valeur (+30, +150), une fois.
    const counters = Array.from(section.querySelectorAll<HTMLElement>('[data-count]'));
    const count = () =>
      counters.forEach((counter) => {
        const [, before = '', digits = '0', after = ''] =
          /^(\D*)(\d+)(.*)$/.exec(counter.dataset.count ?? '') ?? [];
        const value = { n: 0 };
        gsap.to(value, {
          n: Number(digits),
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = `${before}${Math.round(value.n)}${after}`;
          },
        });
      });
    const countTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: count,
    });

    // Écran assez grand : la section se fige, le relais suit la molette.
    media.add(PANEL_QUERY, () => {
      activate(0);
      gsap.set(fill, { scaleX: 0 });
      const content = section.firstElementChild;
      const unfit =
        content instanceof HTMLElement ? fitToScreen(content, panelRoom(section)) : undefined;
      const timeline = gsap.timeline({ defaults: { ease: 'none' } });
      relay(timeline).to({}, { duration: 0.6 }); // un temps sur le dernier métier
      ScrollTrigger.create({
        ...panelPin(section, 270),
        animation: timeline,
        // Un métier s'allume dès que sa photo a couvert la moitié du cadre.
        onUpdate: () => activate(Math.min(LAST, Math.floor(timeline.time() + 0.5))),
      });
      return unfit;
    });

    // Ailleurs : le relais se joue seul, une fois, à l'arrivée du cadre.
    media.add(`not all and ${PANEL_QUERY}`, () => {
      activate(0);
      gsap.set(fill, { scaleX: 0 });
      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'none' },
        onUpdate: () => activate(Math.min(LAST, Math.floor((timeline.time() - 0.4) / 1.6 + 0.5))),
      });
      photos.slice(1).forEach((photo, i) => {
        const image = photo.querySelector('img');
        const at = 0.4 + i * 1.6;
        timeline
          .fromTo(
            photo,
            { clipPath: rtl ? HIDDEN_RTL : HIDDEN },
            { clipPath: SHOWN, duration: 0.9, ease: 'power2.inOut' },
            at,
          )
          .fromTo(image, { scale: 1.18 }, { scale: 1, duration: 1.1, ease: 'power2.out' }, at)
          .to(fill, { scaleX: (i + 1) / LAST, duration: 0.9, ease: 'power2.inOut' }, at);
      });
      timeline.call(() => activate(LAST));
      const trigger = ScrollTrigger.create({
        trigger: figure,
        start: 'top 75%',
        once: true,
        onEnter: () => timeline.play(),
      });
      return () => {
        trigger.kill();
        timeline.kill();
      };
    });

    return () => {
      countTrigger.kill();
      media.revert();
    };
  }, [rtl, sectionRef]);

  return (
    <figure ref={ref} className={styles.relay}>
      <div className={styles.frame} role="img" aria-label={alt}>
        {STEPS.map(({ photo }, index) => (
          <div key={photo} className={styles.photo} data-photo={index}>
            <img
              src={`${photo}-700.webp`}
              srcSet={`${photo}-700.webp 700w, ${photo}.webp 1200w`}
              sizes="(min-width: 64em) 46vw, 92vw"
              width={1200}
              height={900}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
      <div className={styles.trackWrap}>
        <span className={styles.line} aria-hidden="true">
          <span className={styles.fill} data-fill />
        </span>
        <ol className={styles.track}>
          {STEPS.map(({ photo, Icon }, index) => (
            <li key={photo} className={styles.step} data-step={index}>
              <span className={styles.node} aria-hidden="true">
                <Icon size={24} weight="duotone" />
              </span>
              <span className={styles.label}>{lanes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
