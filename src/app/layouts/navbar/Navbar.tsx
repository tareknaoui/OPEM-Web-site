import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { MenuIcon, PhoneIcon } from '@/components/icons';
import { company } from '@/config/company';
import { useScrolled } from '@/hooks/useScrolled';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import type { NavbarVariant } from '../variants/layoutVariants';
import { DesktopMenu } from './DesktopMenu';
import { FullscreenMenu } from './FullscreenMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { DESKTOP_QUERY, QUOTE_HREF } from './menu';
import { MobileMenu } from './MobileMenu';
import styles from './Navbar.module.css';
import { useMenu } from './useMenu';

const MOBILE_MENU_ID = 'mobile-menu';

const FULLSCREEN_MENU_ID = 'fullscreen-menu';

/** Maquettes sur fond bleu nuit : logo blanc, textes blancs. */
const DARK_VARIANTS: readonly NavbarVariant[] = ['nuit', 'editorialenuit', 'prestige'];

/** Maquettes « éditoriales » : soulignement animé, sous-menus pleine largeur. */
const EDITORIAL_VARIANTS: readonly NavbarVariant[] = ['editoriale', 'editorialenuit', 'prestige'];

/**
 * Barre de navigation. Maquettes à comparer (voir ../variants) :
 * - « nuit » (version 1, par défaut) : fond bleu nuit, logo blanc ;
 * - « blanche » : même disposition, fond blanc, logo couleur ;
 * - « flottante » : capsule blanche arrondie, détachée des bords ;
 * - « centree » : logo au centre, menu sur une bande bleu nuit en dessous ;
 * - « pleinecran » : bouton « Menu » qui ouvre un menu éditorial plein écran ;
 * - « editoriale » : barre blanche aérée, sous-menus sur toute la largeur ;
 * - « editorialenuit » : la même sur bleu nuit, logo blanc ;
 * - « prestige » : l'éditoriale bleu nuit avec un méga-menu riche (introduction,
 *   liens numérotés, encart rendez-vous).
 */
export function Navbar({ variant = 'nuit' }: { variant?: NavbarVariant }) {
  const { lang, t } = useLanguage();
  const items = useMenu(lang);
  const isScrolled = useScrolled();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullOpen, setIsFullOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeFull = useCallback(() => setIsFullOpen(false), []);
  const isDark = DARK_VARIANTS.includes(variant);
  const isEditorial = EDITORIAL_VARIANTS.includes(variant);
  const logoTone = isDark ? 'white' : 'color';

  // « Plein écran » : grand menu sur ordinateur, menu mobile habituel sinon.
  const openFullOrMobile = () => {
    if (window.matchMedia(DESKTOP_QUERY).matches) setIsFullOpen(true);
    else setIsMenuOpen(true);
  };

  const quoteLink = (
    <Link to={QUOTE_HREF} className={cx(styles.callback, styles.desktopOnly)}>
      {t.quote}
    </Link>
  );

  const burger = (
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
  );

  return (
    <header
      className={cx(
        styles.header,
        styles[variant],
        isDark && styles.dark,
        isEditorial && styles.editoriale,
        isScrolled && styles.compact,
      )}
    >
      {variant === 'pleinecran' ? (
        <div className={cx('container', styles.bar)}>
          <button
            type="button"
            className={styles.menuButton}
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen || isFullOpen}
            onClick={openFullOrMobile}
          >
            <MenuIcon />
            <span>{t.menu}</span>
          </button>
          <Logo tone={logoTone} />
          <div className={styles.actions}>
            <LanguageSwitcher />
            {quoteLink}
          </div>
        </div>
      ) : variant === 'centree' ? (
        <>
          <div className={cx('container', styles.bar)}>
            <div className={styles.barStart}>
              <a href={company.phone.href} className={cx(styles.phone, styles.desktopOnly)}>
                <PhoneIcon size={16} />
                <span dir="ltr">{company.phone.display}</span>
              </a>
              <LanguageSwitcher />
            </div>
            <Logo tone={logoTone} />
            <div className={styles.actions}>
              {quoteLink}
              {burger}
            </div>
          </div>
          <div className={cx(styles.navRow, styles.desktopOnly)}>
            <div className="container">
              <DesktopMenu items={items} />
            </div>
          </div>
        </>
      ) : (
        <div className={cx('container', styles.bar)}>
          <Logo tone={logoTone} />

          <DesktopMenu
            items={items}
            panel={variant === 'prestige' ? 'rich' : isEditorial ? 'full' : undefined}
          />

          <div className={styles.actions}>
            <LanguageSwitcher />
            {quoteLink}
            {burger}
          </div>
        </div>
      )}

      <MobileMenu
        id={MOBILE_MENU_ID}
        items={items}
        open={isMenuOpen}
        onClose={closeMenu}
        logoTone={logoTone}
      />

      {variant === 'pleinecran' && (
        <FullscreenMenu
          id={FULLSCREEN_MENU_ID}
          items={items}
          open={isFullOpen}
          onClose={closeFull}
        />
      )}
    </header>
  );
}
