import type { Plugin } from 'vite';

/* ==========================================================================
   Référencement, au moment du build :
   - robots.txt et sitemap.xml, générés dans dist/ (sans eux, l'hébergeur renverrait la
     page HTML à leur place) ;
   - %SITE_URL% remplacé dans index.html (image d'aperçu des réseaux sociaux : adresse
     absolue obligatoire).
   L'adresse du site vient de la variable d'environnement SITE_URL (réglage Vercel) ;
   à défaut, l'adresse Vercel actuelle. À changer quand le domaine définitif sera branché.
   ========================================================================== */

const DEFAULT_SITE_URL = 'https://sas-fawn-delta.vercel.app';

/**
 * Pages publiées, dans le plan du site. N'y mettre que les pages réellement construites
 * (une adresse qui mène à « Page introuvable » nuit au référencement).
 */
const PAGES = ['/', '/le-cabinet', '/ia-appliquee', '/contact'];

export function seo(): Plugin {
  const siteUrl = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

  return {
    name: 'opem-seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      const urls = PAGES.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}
