import { useId, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { ArrowUpIcon, ChevronDownIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/icons';
import { company } from '@/config/company';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { CALLBACK_HREF, type MenuItem } from '../navbar/menu';
import { useMenu } from '../navbar/useMenu';
import type { FooterVariant } from '../variants/layoutVariants';
import styles from './Footer.module.css';
import { FooterCompact } from './FooterCompact';
import { legalLinks } from './legalLinks';

type FooterLink = { id: string; label: string; href: string };
type FooterColumn = { id: string; title: string; links: FooterLink[] };

const linkOf = (item: MenuItem): FooterLink[] =>
  item.href ? [{ id: item.id, label: item.label, href: item.href }] : [];

/**
 * Colonnes construites à partir du menu principal (donc modifiables dans WordPress) :
 * une colonne par rubrique ayant des sous-pages, puis « Découvrir » pour le reste.
 * Les emplacements vides (sans lien, ex. secteurs à confirmer) sont ignorés.
 */
function buildColumns(items: MenuItem[], discoverTitle: string, contactLabel: string) {
  const columns: FooterColumn[] = [];
  const discover: FooterLink[] = [];

  for (const item of items) {
    const links = item.children.flatMap(linkOf);
    if (links.length > 0) columns.push({ id: item.id, title: item.label, links });
    else discover.push(...linkOf(item));
  }
  // Lien « Contact » ajouté seulement si le menu n'a pas déjà sa rubrique Contact.
  if (!items.some((item) => item.href === CALLBACK_HREF)) {
    discover.push({ id: 'contact', label: contactLabel, href: CALLBACK_HREF });
  }

  return [...columns, { id: 'discover', title: discoverTitle, links: discover }];
}

function FooterAnchor({ link }: { link: FooterLink }) {
  if (link.href.startsWith('/')) {
    return (
      <NavLink to={link.href} end className={styles.link}>
        {link.label}
      </NavLink>
    );
  }
  return (
    <a href={link.href} className={styles.link}>
      {link.label}
    </a>
  );
}

/**
 * Pied de page. Trois maquettes à comparer (voir ../variants) :
 * - « nuit » (version 1, par défaut) : bandeau d'appel bleu OPEM + corps bleu nuit ;
 * - « clair » : même structure sur fond bleu très clair, logo couleur ;
 * - « compact » : une seule bande bleu nuit (voir FooterCompact).
 */
export function Footer({ variant = 'nuit' }: { variant?: FooterVariant }) {
  if (variant === 'compact') return <FooterCompact />;
  return <FooterColumns light={variant === 'clair'} />;
}

/** Sur mobile, chaque rubrique du plan du site se replie (titre-bouton, motif accordéon). */
const FOOTER_ACCORDION_QUERY = '(max-width: 47.99em)';

function FooterColumns({ light }: { light: boolean }) {
  const { lang, t } = useLanguage();
  const items = useMenu(lang);
  const columns = buildColumns(items, t.footer.discover, t.footer.contactLink);
  const accordion = useMediaQuery(FOOTER_ACCORDION_QUERY);
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <footer className={cx(styles.footer, light && styles.clair)}>
      {/* Bandeau d'appel à l'action */}
      <section className={styles.cta} aria-labelledby="footer-cta-title">
        <div className={cx('container', styles.ctaInner)}>
          <div>
            <h2 id="footer-cta-title" className={styles.ctaTitle}>
              {t.footer.ctaTitle}
            </h2>
            <p className={styles.ctaText}>{t.footer.ctaText}</p>
          </div>
          <div className={styles.ctaActions}>
            <a
              href={company.phone.href}
              className={styles.ctaPhone}
              aria-label={t.footer.callUs(company.phone.display)}
            >
              <PhoneIcon size={20} />
              <span dir="ltr">{company.phone.display}</span>
            </a>
            <Link to={CALLBACK_HREF} className={styles.ctaButton}>
              {t.callback}
            </Link>
          </div>
        </div>
      </section>

      <div className={cx('container', styles.main)}>
        {/* Identité */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <img
              src={light ? '/logo-opem-couleur.svg' : '/logo-opem.svg'}
              alt={t.homeLink}
              width={199}
              height={75}
              loading="lazy"
              className={styles.logo}
            />
          </Link>
          <p className={styles.fullName}>{company.fullName}</p>
          <p className={styles.pitch}>{t.footer.pitch}</p>
        </div>

        {/* Plan du site */}
        <nav aria-label={t.footer.nav} className={styles.columns}>
          {columns.map((column) => {
            const expanded = !accordion || openId === column.id;
            const listId = `${baseId}-${column.id}`;
            return (
              <div key={column.id} className={styles.column}>
                <h2 className={styles.heading}>
                  {accordion ? (
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-expanded={expanded}
                      aria-controls={listId}
                      onClick={() => setOpenId(expanded ? null : column.id)}
                    >
                      {column.title}
                      <ChevronDownIcon size={18} className={styles.chevron} />
                    </button>
                  ) : (
                    column.title
                  )}
                </h2>
                <ul id={listId} className={styles.list} hidden={!expanded}>
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Coordonnées */}
        <div className={styles.contact}>
          <h2 className={styles.heading}>{t.footer.contact}</h2>
          <address className={styles.address}>
            <p className={styles.contactLine}>
              <MapPinIcon size={18} className={styles.contactIcon} />
              <span>
                <span className={styles.srOnly}>{t.footer.address} : </span>
                {company.address[lang]}
                <br />
                <a
                  href={company.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(styles.link, styles.inlineLink)}
                >
                  {t.footer.map}
                  <span className={styles.srOnly}> {t.footer.newTab}</span>
                </a>
              </span>
            </p>
            <p className={styles.contactLine}>
              <PhoneIcon size={18} className={styles.contactIcon} />
              <span>
                <span className={styles.srOnly}>{t.footer.phone} : </span>
                <a href={company.phone.href} className={styles.link} dir="ltr">
                  {company.phone.display}
                </a>
              </span>
            </p>
            <p className={styles.contactLine}>
              <MailIcon size={18} className={styles.contactIcon} />
              <span>
                <span className={styles.srOnly}>{t.footer.email} : </span>
                <a href={`mailto:${company.email}`} className={styles.link} dir="ltr">
                  {company.email}
                </a>
              </span>
            </p>
          </address>
        </div>
      </div>

      {/* Barre du bas */}
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
          {/* Lien natif vers le haut de page : aucun JavaScript nécessaire. */}
          <a href="#top" className={cx(styles.link, styles.backToTop)}>
            {t.footer.backToTop}
            <ArrowUpIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
