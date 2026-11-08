import { useId } from 'react';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import { etudesContent } from './content';
import styles from './EtudesPage.module.css';
import { PointCloud } from './PointCloud';

/**
 * Page du domaine « Études stratégiques », ouverte par « Découvrir ce domaine » (carte 01 de
 * l'accueil et de « Nos expertises »). Page unique, six blocs à venir ; le type de visuel change
 * d'un bloc à l'autre (deux voisins ne se ressemblent jamais).
 * 01 Ouverture, bleu 10 % : texte à gauche ; à droite, image abstraite (un nuage de points qui
 *    se resserre jusqu'au point ambre, sur panneau bleu nuit) ; dessous sur tablette et téléphone.
 * Un seul titre principal (H1, bloc 01) ; les blocs suivants en H2. Textes : ./content.ts.
 */
export default function EtudesPage() {
  const { lang } = useLanguage();
  const t = etudesContent[lang];
  const ids = useId();
  const { opening } = t;

  return (
    <div className={styles.page}>
      <title>{`${t.title} · ${env.appName}`}</title>

      {/* ---------- 01 Ouverture ---------- */}
      <section className={styles.opening} aria-labelledby={`${ids}-opening`}>
        <div className={cx('container', styles.split)}>
          <div className={styles.text}>
            <p className={styles.eyebrow}>{opening.eyebrow}</p>
            <h1 id={`${ids}-opening`} className={styles.title}>
              {opening.title}
            </h1>
            <p className={styles.body}>{opening.text}</p>
          </div>
          <div className={styles.panel}>
            <PointCloud alt={opening.alt} />
          </div>
        </div>
      </section>
    </div>
  );
}
