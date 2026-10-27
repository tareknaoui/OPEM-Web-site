import { useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowRightIcon, ChevronDownIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import {
  APPOINTMENT_HREF,
  barLabel,
  isHomeItem,
  isItemActive,
  isMegaMenu,
  type MenuItem,
} from './menu';
import { MenuLink, NestedLinks } from './MenuLink';
import styles from './Navbar.module.css';

/**
 * Menu desktop. Sous-menus :
 * - souris : ouverture au survol (CSS uniquement) ;
 * - clavier : bouton avec aria-expanded, Échap referme et rend le focus au bouton,
 *   sortir du bloc avec Tab referme aussi.
 */
export function DesktopMenu({ items, panel }: { items: MenuItem[]; panel?: PanelStyle }) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  // Survoler une autre entrée referme un sous-menu ouvert au clavier.
  const handleHover = (id: string) => setOpenId((current) => (current === id ? current : null));

  return (
    <nav aria-label={t.mainNav} className={styles.desktopNav}>
      <ul className={styles.menu}>
        {items
          .filter((item) => !isHomeItem(item))
          .map((item) =>
            item.children.length > 0 ? (
              <SubmenuItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                setOpen={(open) => setOpenId(open ? item.id : null)}
                onHover={() => handleHover(item.id)}
                panel={panel}
              />
            ) : (
              <li key={item.id} className={styles.item} onMouseEnter={() => handleHover(item.id)}>
                <MenuLink item={item} className={styles.topLink} short />
              </li>
            ),
          )}
      </ul>
    </nav>
  );
}

/**
 * Sous-menus sur toute la largeur de la barre :
 * - « full » : titre de la rubrique, « Tout voir », liens ;
 * - « rich » : en plus, introduction de la rubrique, liens numérotés et encart rendez-vous.
 */
type PanelStyle = 'full' | 'rich';

/** Photo de l'encart rendez-vous (l'image fixe de la vidéo d'accueil). */
const FEATURE_IMAGE_SRC = '/videos/hero-opem.jpg';

type SubmenuItemProps = {
  item: MenuItem;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onHover: () => void;
  panel?: PanelStyle;
};

function SubmenuItem({ item, isOpen, setOpen, onHover, panel }: SubmenuItemProps) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const submenuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mega = isMegaMenu(item);
  const rich = panel === 'rich';
  // Pas d'encart « rendez-vous » dans la rubrique qui contient déjà ce lien.
  const withFeature = rich && !item.children.some((child) => child.href === APPOINTMENT_HREF);

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Escape' && isOpen) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  const toggleProps = {
    ref: buttonRef,
    type: 'button' as const,
    'aria-expanded': isOpen,
    'aria-controls': submenuId,
    onClick: () => setOpen(!isOpen),
  };

  const links = item.children.map((child) => (
    <li key={child.id}>
      <MenuLink
        item={child}
        className={mega ? styles.megaLink : styles.submenuLink}
        onClick={() => setOpen(false)}
        withDescription={mega}
      />
      <NestedLinks items={child.children} onClick={() => setOpen(false)} />
    </li>
  ));

  return (
    <li
      className={styles.item}
      data-open={isOpen || undefined}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onMouseEnter={onHover}
    >
      {item.href ? (
        <span className={styles.itemRow}>
          <MenuLink item={item} className={styles.topLink} short />
          <button {...toggleProps} className={styles.chevron} aria-label={t.submenu(item.label)}>
            <ChevronDownIcon />
          </button>
        </span>
      ) : (
        // Entrée sans lien (« # » dans WordPress) : le libellé entier ouvre le sous-menu.
        <button
          {...toggleProps}
          className={cx(styles.topLink, isItemActive(item, pathname) && styles.active)}
        >
          {barLabel(item)}
          <ChevronDownIcon />
        </button>
      )}

      {panel ? (
        <div id={submenuId} className={cx(styles.submenu, styles.panel, rich && styles.panelRich)}>
          <div className={cx('container', styles.panelInner)}>
            <div className={styles.panelIntro}>
              <p className={styles.panelTitle}>{item.label}</p>
              {rich && item.description && <p className={styles.panelLead}>{item.description}</p>}
              {item.href && (
                <Link to={item.href} className={styles.panelAll} onClick={() => setOpen(false)}>
                  {t.seeAll}
                  <ArrowRightIcon size={18} className="arrow" />
                </Link>
              )}
            </div>
            <ul className={styles.panelLinks}>{links}</ul>
            {withFeature && (
              // Photo puis texte sur bandeau bleu nuit : jamais de texte sur l'image (charte).
              <Link
                to={APPOINTMENT_HREF}
                className={styles.panelFeature}
                onClick={() => setOpen(false)}
              >
                <img
                  className={styles.featureImage}
                  src={FEATURE_IMAGE_SRC}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.featureBand}>
                  <span className={styles.featureTitle}>{t.megaFeature.title}</span>
                  <span className={styles.featureText}>{t.megaFeature.text}</span>
                  <span className={styles.featureCta}>
                    {t.megaFeature.cta}
                    <ArrowRightIcon size={16} className="arrow" />
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <ul id={submenuId} className={cx(styles.submenu, mega && styles.mega)}>
          {links}
        </ul>
      )}
    </li>
  );
}
