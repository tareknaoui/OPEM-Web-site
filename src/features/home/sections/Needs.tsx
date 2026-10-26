import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { NeedPictogram } from '../icons';
import styles from './Needs.module.css';
import { SectionHeader } from './SectionHeader';

type Need = HomeContent['needs']['items'][number];

// Place de chaque carte dans la mosaïque (voir grid-template-areas du CSS).
const AREAS = ['a', 'c', 'd', 'e', 'b', 'f'];

/**
 * « Quel est votre besoin ? » : mosaïque (bento), deux grandes cartes et quatre petites.
 * Services présentés par problème du client (inspiration RHR International).
 */
export function Needs({ needs }: { needs: HomeContent['needs'] }) {
  return (
    <section className="section" aria-labelledby="needs-title">
      <div className="container">
        <SectionHeader
          id="needs-title"
          eyebrow={needs.eyebrow}
          title={needs.title}
          lead={needs.lead}
        />
        <ul className={styles.bento}>
          {needs.items.map((item, index) => (
            <NeedCard
              key={item.id}
              item={item}
              area={AREAS[index] ?? 'auto'}
              index={index}
              more={needs.more}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function NeedCard({
  item,
  area,
  index,
  more,
}: {
  item: Need;
  area: string;
  index: number;
  more: string;
}) {
  const reveal = useReveal<HTMLLIElement>();
  const large = item.size === 'large';

  return (
    <li
      ref={reveal}
      data-reveal
      data-area={area}
      className={cx(styles.card, large && styles.large)}
      style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as React.CSSProperties}
    >
      <NeedPictogram name={item.icon} size={large ? 52 : 40} className={styles.icon} />
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.text}>{item.text}</p>
      {/* Toute la carte est cliquable (le lien s'étend sur la carte), un seul arrêt au clavier. */}
      <Link to={item.href} className={styles.link}>
        {more}
        <span className="sr-only"> : {item.title}</span>
        <ArrowRightIcon size={18} className="arrow" />
      </Link>
    </li>
  );
}
