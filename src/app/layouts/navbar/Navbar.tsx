import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { MenuIcon } from '@/components/icons';
import { useScrolled } from '@/hooks/useScrolled';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { DesktopMenu } from './DesktopMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { QUOTE_HREF } from './menu';
import { MobileMenu } from './MobileMenu';
import styles from './Navbar.module.css';
import { useMenu } from './useMenu';

const MOBILE_MENU_ID = 'mobile-menu';

/** Barre de navigation éditoriale sur bleu nuit : logo blanc, sous-menus pleine largeur. */
export function Navbar() {
  const { lang, t } = useLanguage();
  const items = useMenu(lang);
  const isScrolled = useScrolled();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <header
      className={cx(styles.header, styles.dark, styles.editoriale, isScrolled && styles.compact)}
    >
      <div className={cx('container', styles.bar)}>
        <Logo />

        <DesktopMenu items={items} />

        <div className={styles.actions}>
          <LanguageSwitcher />
          <Link to={QUOTE_HREF} className={cx(styles.callback, styles.desktopOnly)}>
            {t.quote}
          </Link>
          <button
            type="button"
            className={cx(styles.iconButton, styles.mobileOnly)}
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={t.openMenu}
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <MobileMenu id={MOBILE_MENU_ID} items={items} open={isMenuOpen} onClose={closeMenu} />
    </header>
  );
}
