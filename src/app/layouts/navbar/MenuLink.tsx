import { NavLink } from 'react-router';
import { cx } from '@/lib/cx';
import { barLabel, type MenuItem } from './menu';
import styles from './Navbar.module.css';

type MenuLinkProps = {
  item: MenuItem;
  className?: string;
  onClick?: () => void;
  /** Méga-menu : affiche la courte description sous le libellé. */
  withDescription?: boolean;
  /** Barre desktop : libellé court s'il existe (« Expertises » pour « Nos expertises »). */
  short?: boolean;
};

/** Lien interne (navigation sans rechargement), lien externe, ou emplacement vide. */
export function MenuLink({ item, className, onClick, withDescription, short }: MenuLinkProps) {
  const content =
    withDescription && item.description ? (
      <>
        <span className={styles.megaTitle}>{item.label}</span>
        <span className={styles.megaText}>{item.description}</span>
      </>
    ) : short ? (
      barLabel(item)
    ) : (
      item.label
    );

  if (!item.href) {
    return <span className={cx(className, styles.placeholder)}>{content}</span>;
  }

  if (item.href.startsWith('/')) {
    return (
      <NavLink
        to={item.href}
        end={item.href === '/'}
        onClick={onClick}
        className={({ isActive }) => cx(className, isActive && styles.active)}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a href={item.href} className={className} onClick={onClick}>
      {content}
    </a>
  );
}

/**
 * Troisième niveau (ex. « Diagnostic d'entreprise » sous « Accompagnement des
 * organisations ») : liens secondaires en retrait sous leur page parente.
 */
export function NestedLinks({ items, onClick }: { items: MenuItem[]; onClick?: () => void }) {
  if (items.length === 0) return null;
  return (
    <ul className={styles.nested}>
      {items.map((item) => (
        <li key={item.id}>
          <MenuLink item={item} className={styles.nestedLink} onClick={onClick} />
        </li>
      ))}
    </ul>
  );
}
