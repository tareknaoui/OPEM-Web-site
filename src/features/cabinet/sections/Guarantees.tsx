import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import type { CabinetContent } from '../content';
import { GUARANTEE_ICONS } from '../icons';
import { motionAllowed } from '../useCabinetMotion';
import styles from './Guarantees.module.css';

const PHOTO = '/images/cabinet/garanties-session';

/**
 * 08 « Nos garanties », sur bleu 10 % (après le bloc 07 sur blanc) : surtitre et titre, puis le
 * bandeau photo, une vraie session OPEM (album du cabinet). Sous la photo, un panneau blanc en
 * chevauche le bas et porte les six garanties : jamais de texte sur la photo. Un même filet
 * bleu 30 % au-dessus de chaque garantie.
 * Ordinateur : trois colonnes ; tablette : deux ; téléphone : une (photo recadrée en 4:3).
 * Au défilement : la photo se découvre comme un rideau et glisse en légère parallaxe (moteur de
 * la page) ; les filets se tracent et les garanties se posent une à une, une seule fois.
 */
export function Guarantees({ guarantees }: { guarantees: CabinetContent['guarantees'] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    const panel = section?.querySelector('[data-panel-list]');
    if (!section || !panel || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: panel, start: 'top 92%', once: true } })
        .from('[data-rule]', {
          scaleX: 0,
          duration: 0.8,
          ease: 'power3.inOut',
          stagger: 0.08,
        })
        .from(
          '[data-guarantee]',
          { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
          '<0.15',
        );
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="nos-garanties">
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {guarantees.eyebrow}
          </p>
          <h2 id="nos-garanties" className={styles.title} data-motion="title">
            {guarantees.title}
          </h2>
        </div>

        <div className={styles.photo} data-motion="unveil" data-parallax>
          <picture>
            <source media="(max-width: 39.99em)" srcSet={`${PHOTO}-mobile.webp`} />
            <img
              src={`${PHOTO}-1200.webp`}
              srcSet={`${PHOTO}-1200.webp 1200w, ${PHOTO}.webp 2400w`}
              sizes="(min-width: 80em) 76rem, 100vw"
              width={2400}
              height={1029}
              alt={guarantees.alt}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <ol className={styles.panel} data-panel-list>
          {guarantees.items.map((item, index) => {
            const Icon = GUARANTEE_ICONS[index];
            return (
              <li key={item.title} className={styles.item}>
                <span className={styles.rule} aria-hidden="true" data-rule />
                <div className={styles.body} data-guarantee>
                  <h3 className={styles.itemTitle}>
                    {Icon && (
                      <span className={styles.icon} aria-hidden="true">
                        <Icon size={22} weight="duotone" />
                      </span>
                    )}
                    {item.title}
                  </h3>
                  <p className={styles.itemText}>{item.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
