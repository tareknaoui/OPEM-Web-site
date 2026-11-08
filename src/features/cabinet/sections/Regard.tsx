import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import type { CabinetContent } from '../content';
import { fitToScreen, motionAllowed, PANEL_QUERY, panelPin, panelRoom } from '../useCabinetMotion';
import styles from './Regard.module.css';

const DIR = '/images/cabinet';

/**
 * Une image-symbole par idée (Pexels, licence libre) : une corde qui s'effiloche (la performance
 * qui s'use dans les petits écarts) ; des engrenages qui s'entraînent (public ou privé, les mêmes
 * leviers) ; une goutte et ses ondes (l'IA qui amplifie ce qu'elle touche). Décoratives : le texte
 * porte le sens.
 */
const PHOTOS = ['regard-usure', 'regard-leviers', 'regard-amplifie'];

/**
 * 03 « Notre regard », sur bleu 10 % (alterne avec le bloc 02 sur blanc) : surtitre (filet
 * vert) et titre, puis trois idées en cartes de même hauteur, chacune ouverte par une
 * image-symbole, son numéro en vert foncé, son titre en bleu nuit et son texte. Au défilement : sur un
 * écran assez grand, la section se fige et les trois idées se dévoilent l'une après l'autre
 * (photo comme un rideau, puis le texte) ; ailleurs, chacune se dévoile à son arrivée. Les
 * photos glissent en légère parallaxe. Ordinateur : trois colonnes alignées ; tablette :
 * une carte par ligne, photo à côté du texte ; téléphone : tout s'empile.
 */
export function Regard({ regard }: { regard: CabinetContent['regard'] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(section);
    const cards = () =>
      Array.from(section.querySelectorAll('[data-idea]'), (card) => ({
        card,
        art: card.querySelector('[data-art]'),
        body: card.querySelectorAll('[data-body]'),
      }));
    const hidden = { clipPath: 'inset(100% 0% 0% 0%)' };
    const shown = { clipPath: 'inset(0% 0% 0% 0%)' };

    // Écran assez grand : la section se fige, les trois idées se dévoilent l'une après l'autre.
    media.add(PANEL_QUERY, () => {
      const unfit =
        section.firstElementChild instanceof HTMLElement
          ? fitToScreen(section.firstElementChild, panelRoom(section))
          : undefined;
      const timeline = gsap.timeline({ scrollTrigger: panelPin(section, 90) });
      cards().forEach(({ art, body }) => {
        timeline
          .fromTo(art, hidden, { ...shown, duration: 1, ease: 'power2.out' })
          .from(body, { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, '<0.4');
      });
      timeline.to({}, { duration: 1.2 }); // un temps sur les trois idées
      return unfit;
    });
    // Ailleurs : chaque idée se dévoile à son arrivée.
    media.add(`not all and ${PANEL_QUERY}`, () => {
      cards().forEach(({ card, art }) => {
        gsap.fromTo(art, hidden, {
          ...shown,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        });
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="notre-regard" data-panel>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {regard.eyebrow}
          </p>
          <h2 id="notre-regard" className={styles.title} data-motion="title">
            {regard.title}
          </h2>
        </div>

        <ol className={styles.ideas}>
          {regard.ideas.map((idea, index) => (
            <li key={idea.title} className={styles.idea} data-idea>
              <div className={styles.art} data-art>
                {PHOTOS[index] && (
                  <div className={styles.photo} data-parallax>
                    <img
                      src={`${DIR}/${PHOTOS[index]}.webp`}
                      srcSet={`${DIR}/${PHOTOS[index]}-700.webp 700w, ${DIR}/${PHOTOS[index]}.webp 1200w`}
                      sizes="(min-width: 64em) 30vw, (min-width: 40em) 44vw, 100vw"
                      width={1200}
                      height={800}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
              </div>
              <span className={styles.number} aria-hidden="true" data-body>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.ideaTitle} data-body>
                {idea.title}
              </h3>
              <p className={styles.ideaText} data-body>
                {idea.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
