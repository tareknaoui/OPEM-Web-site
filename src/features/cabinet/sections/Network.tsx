import type { CabinetContent } from '../content';
import { TRAIT_ICONS } from '../icons';
import { NetworkArt } from './NetworkArt';
import styles from './Network.module.css';

/**
 * 07 « Notre réseau d'experts », sur blanc (après le bleu nuit du bloc 06) : surtitre et titre,
 * la carte du réseau sur toute la largeur (NetworkArt), puis les cinq traits, intitulés en bleu
 * OPEM : côte à côte sur ordinateur, deux par deux sur tablette, empilés sur téléphone.
 */
export function Network({ network }: { network: CabinetContent['network'] }) {
  return (
    <section className={styles.section} aria-labelledby="notre-reseau">
      <div className="container">
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {network.eyebrow}
          </p>
          <h2 id="notre-reseau" className={styles.title} data-motion="title">
            {network.title}
          </h2>
        </div>

        <NetworkArt network={network} />

        <ul className={styles.traits} data-reveal-stagger>
          {network.traits.map((trait, index) => {
            const Icon = TRAIT_ICONS[index];
            return (
              <li key={trait.title} className={styles.trait}>
                {Icon && (
                  <span className={styles.traitIcon} aria-hidden="true">
                    <Icon size={28} weight="duotone" />
                  </span>
                )}
                <h3 className={styles.traitTitle}>{trait.title}</h3>
                <p className={styles.traitText}>{trait.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
