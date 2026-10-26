import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useReveal } from '@/hooks/useReveal';
import type { HomeContent } from '../content';
import styles from './Audiences.module.css';
import { SectionHeader } from './SectionHeader';

/**
 * « Vous êtes… » : deux grands panneaux côte à côte (inspiration Demos).
 * Photo en haut, texte sur un bandeau bleu nuit plein : jamais de texte sur la photo (charte).
 * Au survol, le panneau s'élargit légèrement.
 */
export function Audiences({ audiences }: { audiences: HomeContent['audiences'] }) {
  const reveal = useReveal<HTMLUListElement>();

  return (
    <section className="section" aria-labelledby="audiences-title">
      <div className="container">
        <SectionHeader
          id="audiences-title"
          eyebrow={audiences.eyebrow}
          title={audiences.title}
          layout="stacked"
        />
        <ul ref={reveal} data-reveal className={styles.panels}>
          {audiences.items.map((item) => (
            <li key={item.id} className={styles.panel}>
              <div className={styles.media}>
                {/* Illustration provisoire, décorative : alt vide. Avec une vraie photo,
                    décrire l'image si elle apporte une information. */}
                <img
                  src={item.image}
                  alt=""
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={`on-dark ${styles.band}`}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
                <Link to={item.link.href} className={styles.link}>
                  {item.link.label}
                  <ArrowRightIcon size={18} className="arrow" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
