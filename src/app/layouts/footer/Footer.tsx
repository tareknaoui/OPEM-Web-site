import { useId, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { ArrowUpIcon, ChevronDownIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/icons';
import { company } from '@/config/company';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { CALLBACK_HREF, JOIN_HREF, type MenuItem } from '../navbar/menu';
import { useMenu } from '../navbar/useMenu';
import styles from './Footer.module.css';
import { legalLinks } from './legalLinks';

type FooterLink = { id: string; label: string; href: string };
type FooterColumn = { id: string; title: string; links: FooterLink[] };

const linkOf = (item: MenuItem): FooterLink[] =>
  item.href ? [{ id: item.id, label: item.label, href: item.href }] : [];

/** Rubrique du menu dont les sous-pages forment la colonne « Nos expertises ». */
const EXPERTISES_HREF = '/nos-expertises';

/**
 * Deux colonnes seulement, construites à partir du menu principal (donc modifiables dans
 * WordPress) : « Nos expertises » (les sous-pages de la rubrique) et « Le site » (toutes les
 * rubriques, sans l'accueil : le logo y mène déjà, puis « Rejoindre notre réseau »). Les
 * emplacements vides
 * (sans lien) sont ignorés.
 */
function buildColumns(
  items: MenuItem[],
  titles: { expertises: string; site: string; join: string },
  contactLabel: string,
) {
  const expertises = items.find((item) => item.href === EXPERTISES_HREF);
  // « Le site » reprend les rubriques du menu avec leurs intitulés complets (« Nos expertises »,
  // « Formation qualifiante »…), « Nos expertises » compris : mêmes libellés aux deux endroits.
  const site = items.filter((item) => item.href !== '/').flatMap(linkOf);
  // Lien « Contact » ajouté seulement si le menu n'a pas déjà sa rubrique Contact.
  if (!items.some((item) => item.href === CALLBACK_HREF)) {
    site.push({ id: 'contact', label: contactLabel, href: CALLBACK_HREF });
  }
  // « Rejoindre notre réseau » : la page de candidature des experts, toujours au pied de page.
  site.push({ id: 'rejoindre-notre-reseau', label: titles.join, href: JOIN_HREF });

  const columns: FooterColumn[] = [];
  const expertiseLinks = expertises?.children.flatMap(linkOf) ?? [];
  if (expertiseLinks.length > 0) {
    columns.push({ id: 'expertises', title: titles.expertises, links: expertiseLinks });
  }
  columns.push({ id: 'site', title: titles.site, links: site });
  return columns;
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

/** Sur mobile, chaque rubrique du plan du site se replie (titre-bouton, motif accordéon). */
const FOOTER_ACCORDION_QUERY = '(max-width: 47.99em)';

/**
 * Pied de page : bandeau d'appel bleu OPEM, puis corps bleu nuit avec à gauche le logo et la
 * présentation, au milieu « Nos expertises » et « Le site », à droite « Nous contacter ».
 */
export function Footer() {
  const { lang, t } = useLanguage();
  const items = useMenu(lang);
  const columns = buildColumns(items, t.footer, t.footer.contactLink);
  const accordion = useMediaQuery(FOOTER_ACCORDION_QUERY);
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <footer className={styles.footer}>
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
              src="/logo-opem.svg"
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
            © {new Date().getFullYear()} {company.shortName} - {company.fullName}. {t.footer.rights}
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
