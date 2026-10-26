import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CloseIcon, MailIcon, PhoneIcon } from '@/components/icons';
import { company } from '@/config/company';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { DESKTOP_QUERY, QUOTE_HREF, type MenuItem } from './menu';
import { MenuLink, NestedLinks } from './MenuLink';
import styles from './Navbar.module.css';

type FullscreenMenuProps = {
  id: string;
  items: MenuItem[];
  open: boolean;
  onClose: () => void;
};

/**
 * Menu éditorial plein écran (maquette « plein écran », sur ordinateur).
 * À gauche les rubriques en grand ; à droite les liens de la rubrique choisie.
 * Même socle que le menu mobile : <dialog> natif (focus, Échap, page inerte).
 */
export function FullscreenMenu({ id, items, open, onClose }: FullscreenMenuProps) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const current =
    items.find((item) => item.id === selectedId) ?? items.find((item) => item.children.length > 0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Passage en format mobile : c'est le menu mobile qui prend le relais.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => !desktop.matches && onClose();
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [open, onClose]);

  return (
    <dialog ref={dialogRef} id={id} className={styles.fullMenu} onClose={onClose}>
      <div className={cx('container', styles.fullHeader)}>
        <Logo tone="white" onClick={onClose} />
        <button ref={closeRef} type="button" className={styles.fullClose} onClick={onClose}>
          {t.close}
          <CloseIcon size={20} />
        </button>
      </div>

      <div className={cx('container', styles.fullBody)}>
        <nav aria-label={t.mainNav}>
          <ol className={styles.fullList}>
            {items.map((item, index) => (
              <li key={item.id} className={styles.fullItem}>
                <span className={styles.fullIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.children.length > 0 ? (
                  <button
                    type="button"
                    className={cx(styles.fullEntry, item === current && styles.fullEntryCurrent)}
                    aria-expanded={item === current}
                    aria-controls={panelId}
                    onClick={() => setSelectedId(item.id)}
                    onMouseEnter={() => setSelectedId(item.id)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <MenuLink item={item} className={styles.fullEntry} onClick={onClose} />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {current && (
          <div id={panelId} className={styles.fullPanel}>
            <p className={styles.fullPanelTitle}>{current.label}</p>
            <ul className={styles.fullLinks}>
              {current.children.map((child) => (
                <li key={child.id}>
                  <MenuLink
                    item={child}
                    className={styles.fullLink}
                    onClick={onClose}
                    withDescription
                  />
                  <NestedLinks items={child.children} onClick={onClose} />
                </li>
              ))}
            </ul>
            {current.href && (
              <Link to={current.href} className={styles.fullAll} onClick={onClose}>
                {t.seeAll} — {current.label}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
            )}
          </div>
        )}
      </div>

      <div className={cx('container', styles.fullFooter)}>
        <a href={company.phone.href} className={styles.fullContact}>
          <PhoneIcon size={18} />
          <span dir="ltr">{company.phone.display}</span>
        </a>
        <a href={`mailto:${company.email}`} className={styles.fullContact}>
          <MailIcon size={18} />
          <span dir="ltr">{company.email}</span>
        </a>
        <LanguageSwitcher />
        <Link to={QUOTE_HREF} className={cx('btn btn-light', styles.fullCta)} onClick={onClose}>
          {t.quote}
        </Link>
      </div>
    </dialog>
  );
}
