import { Link } from 'react-router';
import { legalLinks } from '@/app/layouts/footer/legalLinks';
import type { MenuItem } from '@/app/layouts/navbar/menu';
import { useMenu } from '@/app/layouts/navbar/useMenu';
import { isPublished } from '@/config/pages';
import { strings } from '@/i18n/strings';
import { useLanguage } from '@/i18n/useLanguage';
import { sitemapContent } from './content';
import styles from './Legal.module.css';
import { LegalBody, LegalHero } from './LegalLayout';

/** Lien interne vers une vraie page, ou lien externe (menu WordPress). */
const reachable = (href?: string): href is string =>
  !!href && (href.startsWith('/') ? isPublished(href) : /^https?:\/\//.test(href));

/** Garde les entrées qui mènent à une page existante (et leurs sous-entrées valides). */
function prune(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => {
    const children = prune(item.children);
    if (!reachable(item.href) && children.length === 0) return [];
    return [{ ...item, children }];
  });
}

function ItemLink({ item }: { item: MenuItem }) {
  if (!reachable(item.href)) return <span>{item.label}</span>;
  return item.href.startsWith('/') ? (
    <Link to={item.href}>{item.label}</Link>
  ) : (
    <a href={item.href} target="_blank" rel="noopener noreferrer">
      {item.label}
    </a>
  );
}

function Tree({ items }: { items: MenuItem[] }) {
  return (
    <ul className={styles.tree}>
      {items.map((item) => (
        <li key={item.id}>
          <ItemLink item={item} />
          {item.children.length > 0 && <Tree items={item.children} />}
        </li>
      ))}
    </ul>
  );
}

/**
 * Page « Plan du site » (/plan-du-site). Construite à partir du menu (donc à jour si OPEM le
 * modifie dans WordPress), sans les adresses qui mèneraient à « Page introuvable »
 * (src/config/pages.ts) : d'abord les rubriques sans sous-pages, puis une colonne par rubrique,
 * enfin les pages légales.
 */
export default function SitemapPage() {
  const { lang } = useLanguage();
  const t = sitemapContent[lang];
  const footer = strings[lang].footer;
  const items = prune(useMenu(lang));
  const essentials = items.filter((item) => item.children.length === 0);
  const sections = items.filter((item) => item.children.length > 0);

  return (
    <>
      <title>{t.title}</title>
      <LegalHero eyebrow={t.eyebrow} heading={t.heading} intro={t.intro} />
      <LegalBody>
        <div className={styles.sitemap}>
          {essentials.length > 0 && (
            <section className={styles.group} aria-labelledby="plan-essentiel">
              <h2 id="plan-essentiel" className={styles.groupTitle}>
                {t.essentials}
              </h2>
              <Tree items={essentials} />
            </section>
          )}
          {sections.map((item) => (
            <section key={item.id} className={styles.group} aria-labelledby={`plan-${item.id}`}>
              <h2 id={`plan-${item.id}`} className={styles.groupTitle}>
                <ItemLink item={item} />
              </h2>
              <Tree items={item.children} />
            </section>
          ))}
          <section className={styles.group} aria-labelledby="plan-legal">
            <h2 id="plan-legal" className={styles.groupTitle}>
              {t.legal}
            </h2>
            <ul className={styles.tree}>
              {legalLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link to={href}>{footer[key]}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </LegalBody>
    </>
  );
}
