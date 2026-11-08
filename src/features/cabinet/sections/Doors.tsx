import { Fragment } from 'react';
import { Link } from 'react-router';
import { JOIN_HREF, QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { CabinetContent } from '../content';
import { DOOR_ICONS } from '../icons';
import styles from './Doors.module.css';

/** Les mots à trait d'union (« parlons-en ») ne se coupent jamais en fin de ligne. */
function KeepHyphens({ text }: { text: string }) {
  return text.split(/(\S+-\S+)/).map((part, index) =>
    index % 2 ? (
      <span key={index} className={styles.nowrap}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/**
 * 09 « Deux portes », dernier bloc de la page, sur blanc (cartes bleu 10 %) : surtitre et titre, puis deux
 * grandes cartes, deux portes entrouvertes (un filet de lumière ambre sur le bord d'entrée,
 * qui s'élargit au survol comme une porte qui s'ouvre). Chacune : à qui elle s'adresse, le
 * texte, le bouton. « Parlons de votre projet » (bouton plein) mène là où mène le bouton du
 * menu ; « Rejoindre notre réseau » (bouton contour) à la page du même nom. Téléphone : les
 * portes s'empilent, boutons sur toute la largeur.
 */
export function Doors({ doors }: { doors: CabinetContent['doors'] }) {
  const entries = [
    { key: 'client', door: doors.client, href: QUOTE_HREF, primary: true },
    { key: 'expert', door: doors.expert, href: JOIN_HREF, primary: false },
  ] as const;

  return (
    <section className={styles.section} aria-labelledby="deux-portes">
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {doors.eyebrow}
          </p>
          <h2 id="deux-portes" className={styles.title} data-motion="title">
            {doors.title}
          </h2>
        </div>

        <ul className={styles.doors} data-reveal-stagger>
          {entries.map(({ key, door, href, primary }) => {
            const Icon = DOOR_ICONS[key];
            return (
              <li key={key} className={styles.door}>
                <span className={styles.doorIcon} aria-hidden="true">
                  <Icon size={30} weight="duotone" />
                </span>
                <h3 className={styles.doorTitle}>{door.title}</h3>
                <p className={styles.doorText}>
                  <KeepHyphens text={door.text} />
                </p>
                <Link
                  to={href}
                  className={cx('btn', primary ? 'btn-primary' : 'btn-secondary', styles.cta)}
                >
                  {door.cta}
                  <ArrowRightIcon size={18} className="arrow" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
