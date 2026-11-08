import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import type { CabinetContent } from '../content';
import { VALUE_ICONS } from '../icons';
import { motionAllowed, panelPin } from '../useCabinetMotion';
import styles from './Values.module.css';

/** Écran assez haut pour la scène des valeurs (une valeur à la fois), quelle que soit la largeur. */
const STAGE_QUERY = '(min-height: 36em)';

/**
 * 05 « Nos valeurs », sur bleu 10 % : un manifeste. Surtitre et titre, puis les six valeurs :
 * un grand numéro, l'icône et l'intitulé en petit, la phrase en très grand (pas de guillemets :
 * ce ne sont pas des citations).
 * Au défilement (GSAP) : la section se fige plein écran et les valeurs passent une à une, en
 * grand ; le sommaire des six valeurs (à gauche sur ordinateur, en six traits sur téléphone)
 * dit où l'on en est ; la page reprend après la sixième. Sans script, en mouvement réduit ou
 * sur un écran trop bas : les six valeurs en liste.
 */
export function Values({ values }: { values: CabinetContent['values'] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    const list = section?.querySelector<HTMLElement>('[data-list]');
    if (!section || !list || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(section);

    media.add(STAGE_QUERY, () => {
      const items = Array.from(list.children) as HTMLElement[];
      const segments = section.querySelectorAll('[data-segment]');
      // La carte prend au moins la hauteur de la plus haute valeur ; elles s'y superposent.
      section.dataset.stage = '';
      const fit = () => {
        list.style.minHeight = '';
        list.style.minHeight = `${Math.max(...items.map((item) => item.offsetHeight))}px`;
      };
      fit();
      ScrollTrigger.addEventListener('refreshInit', fit);

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: panelPin(section, items.length * 55),
      });
      const entries = section.querySelectorAll('[data-index]');
      const part = (item: HTMLElement, name: string) => item.querySelector(`[data-${name}]`) ?? [];
      gsap.set(items.slice(1), { autoAlpha: 0, y: 48 });
      gsap.set(Array.from(entries).slice(1), { opacity: 0.45 });
      timeline.fromTo(segments[0] ?? [], { scaleY: 0 }, { scaleY: 1, duration: 0.6 });
      items.slice(1).forEach((item, index) => {
        timeline
          .to({}, { duration: 0.9 }) // le temps de lire la valeur
          .to(items[index] ?? [], { autoAlpha: 0, y: -48, duration: 0.45 })
          .to(item, { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.3')
          .from(part(item, 'numeral'), { yPercent: 35, duration: 0.7, ease: 'power3.out' }, '<')
          .from(
            part(item, 'mark'),
            { rotate: -14, scale: 0.8, duration: 0.8, ease: 'power3.out' },
            '<',
          )
          .to(entries[index] ?? [], { opacity: 0.45, duration: 0.4 }, '<')
          .to(entries[index + 1] ?? [], { opacity: 1, duration: 0.4 }, '<')
          .fromTo(segments[index + 1] ?? [], { scaleY: 0 }, { scaleY: 1, duration: 0.6 }, '<');
      });
      timeline.to({}, { duration: 1 });

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', fit);
        list.style.minHeight = '';
        delete section.dataset.stage;
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="nos-valeurs">
      <div className={`container ${styles.layout}`}>
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {values.eyebrow}
          </p>
          <h2 id="nos-valeurs" className={styles.title} data-motion="title">
            {values.title}
          </h2>
          {/* Le sommaire des six valeurs : sur la scène, il dit laquelle est à l'écran. */}
          <ol className={styles.index} aria-hidden="true">
            {values.items.map((value, index) => (
              <li key={value.label} className={styles.indexItem} data-index>
                <span className={styles.segment}>
                  <span className={styles.segmentFill} data-segment />
                </span>
                <span className={styles.indexNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.indexLabel}>{value.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <ol className={styles.list} data-list>
          {values.items.map((value, index) => {
            const Icon = VALUE_ICONS[index];
            return (
              <li key={value.label} className={styles.item}>
                <span className={styles.numeral} aria-hidden="true" data-numeral>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {Icon && (
                  <span className={styles.mark} aria-hidden="true" data-mark>
                    <Icon size={160} weight="duotone" />
                  </span>
                )}
                <h3 className={styles.label}>
                  {Icon && (
                    <span className={styles.icon} aria-hidden="true">
                      <Icon size={22} weight="duotone" />
                    </span>
                  )}
                  {value.label}
                </h3>
                <p className={styles.text}>{value.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
