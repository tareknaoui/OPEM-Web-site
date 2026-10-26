import { Link, NavLink } from 'react-router';
import { ArrowUpIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/icons';
import { company } from '@/config/company';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { CALLBACK_HREF } from '../navbar/menu';
import { useMenu } from '../navbar/useMenu';
import styles from './FooterCompact.module.css';
import { legalLinks } from './legalLinks';

/**
 * Maquette « compact » : une seule bande bleu nuit, l'essentiel en trois lignes :
 * logo + rubriques + bouton, coordonnées, puis mentions légales.
 */
export function FooterCompact() {
  const { lang, t } = useLanguage();
  const items = useMenu(lang).filter((item) => item.href);

  return (
    <footer className={styles.footer}>
      <div className={cx('container', styles.top)}>
        <Link to="/" className={styles.logoLink}>
          <img
            src="/logo-opem.svg"
            alt={t.homeLink}
            width={199}
            height={75}
            loading="lazy"
            className={styles.logo}
          />
        </Link>

        <nav aria-label={t.footer.nav}>
          <ul className={styles.links}>
            {items.map((item) => (
              <li key={item.id}>
                <NavLink to={item.href!} className={styles.link}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to={CALLBACK_HREF} className={cx('btn btn-light', styles.cta)}>
          {t.callback}
        </Link>
      </div>

      <div className="container">
        <address className={styles.contact}>
          <span className={styles.contactItem}>
            <MapPinIcon size={16} />
            <span className="sr-only">{t.footer.address} : </span>
            {company.address[lang]}
          </span>
          <a href={company.phone.href} className={cx(styles.contactItem, styles.link)}>
            <PhoneIcon size={16} />
            <span className="sr-only">{t.footer.phone} : </span>
            <span dir="ltr">{company.phone.display}</span>
          </a>
          <a href={`mailto:${company.email}`} className={cx(styles.contactItem, styles.link)}>
            <MailIcon size={16} />
            <span className="sr-only">{t.footer.email} : </span>
            <span dir="ltr">{company.email}</span>
          </a>
        </address>
      </div>

      <div className={styles.bottom}>
        <div className={cx('container', styles.bottomInner)}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {company.shortName} — {company.fullName}. {t.footer.rights}
          </p>
          <ul className={styles.legal} aria-label={t.footer.legal}>
            {legalLinks.map(({ key, href }) => (
              <li key={key}>
                <Link to={href} className={styles.link}>
                  {t.footer[key]}
                </Link>
              </li>
            ))}
          </ul>
          <a href="#top" className={cx(styles.link, styles.backToTop)}>
            {t.footer.backToTop}
            <ArrowUpIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
