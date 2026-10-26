import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ChevronDownIcon, CloseIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo, type LogoTone } from './Logo';
import { DESKTOP_QUERY, QUOTE_HREF, type MenuItem } from './menu';
import { MenuLink, NestedLinks } from './MenuLink';
import styles from './Navbar.module.css';

type MobileMenuProps = {
  id: string;
  items: MenuItem[];
  open: boolean;
  onClose: () => void;
  logoTone?: LogoTone;
};

/**
 * Panneau plein écran basé sur <dialog> natif : le navigateur gère gratuitement
 * le piège du focus, la touche Échap, le retour du focus sur le burger
 * et rend le reste de la page inaccessible tant qu'il est ouvert.
 */
export function MobileMenu({ id, items, open, onClose, logoTone = 'white' }: MobileMenuProps) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus(); // focus sur « Fermer » plutôt que sur le logo
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Si l'écran passe en format desktop, le panneau n'a plus de raison d'être.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => desktop.matches && onClose();
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [open, onClose]);

  return (
    <dialog ref={dialogRef} id={id} className={styles.mobilePanel} onClose={onClose}>
      <div className={styles.mobileHeader}>
        <Logo onClick={onClose} tone={logoTone} />
        <button
          ref={closeRef}
          type="button"
          className={styles.iconButton}
          onClick={onClose}
          aria-label={t.closeMenu}
        >
          <CloseIcon />
        </button>
      </div>

      <nav aria-label={t.mainNav} className={styles.mobileNav}>
        <ul className={styles.mobileList}>
          {items.map((item) => (
            <MobileItem key={item.id} item={item} onNavigate={onClose} />
          ))}
        </ul>
      </nav>

      <div className={styles.mobileFooter}>
        <LanguageSwitcher />
        <Link to={QUOTE_HREF} className={cx('btn btn-primary', styles.mobileCta)} onClick={onClose}>
          {t.quote}
        </Link>
      </div>
    </dialog>
  );
}

function MobileItem({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const submenuId = useId();

  if (item.children.length === 0) {
    return (
      <li className={styles.mobileItem}>
        <MenuLink item={item} className={styles.mobileLink} onClick={onNavigate} />
      </li>
    );
  }

  const toggleProps = {
    type: 'button' as const,
    'aria-expanded': expanded,
    'aria-controls': submenuId,
    onClick: () => setExpanded(!expanded),
  };

  return (
    <li className={styles.mobileItem} data-open={expanded || undefined}>
      <div className={styles.mobileRow}>
        {item.href ? (
          <>
            <MenuLink item={item} className={styles.mobileLink} onClick={onNavigate} />
            <button
              {...toggleProps}
              className={cx(styles.iconButton, styles.chevron)}
              aria-label={t.submenu(item.label)}
            >
              <ChevronDownIcon size={20} />
            </button>
          </>
        ) : (
          <button {...toggleProps} className={styles.mobileLink}>
            {item.label}
            <ChevronDownIcon size={20} />
          </button>
        )}
      </div>

      <ul id={submenuId} className={styles.mobileSublist} hidden={!expanded}>
        {item.children.map((child) => (
          <li key={child.id}>
            <MenuLink item={child} className={styles.mobileSublink} onClick={onNavigate} />
            <NestedLinks items={child.children} onClick={onNavigate} />
          </li>
        ))}
      </ul>
    </li>
  );
}
