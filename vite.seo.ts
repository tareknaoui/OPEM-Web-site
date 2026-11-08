import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';

/* ==========================================================================
   Référencement, au moment du build :
   - robots.txt et sitemap.xml, générés dans dist/ (sans eux, l'hébergeur renverrait la
     page HTML à leur place) ;
   - %SITE_URL% remplacé dans index.html (image d'aperçu des réseaux sociaux : adresse
     absolue obligatoire) ;
   - pour chaque page de PAGE_META, une copie d'index.html à son nom (dist/le-cabinet.html,
     servie à l'adresse /le-cabinet grâce à « cleanUrls » dans vercel.json) portant son titre,
     sa description, ses réglages des réseaux sociaux et son adresse canonique : Google, les
     aperçus de liens (WhatsApp, LinkedIn, Facebook) et les outils d'IA, qui n'exécutent pas
     tous le JavaScript, les lisent dès l'ouverture.
   L'adresse du site vient de la variable d'environnement SITE_URL (réglage Vercel) ;
   à défaut, l'adresse Vercel actuelle. À changer quand le domaine définitif sera branché.
   ========================================================================== */

const DEFAULT_SITE_URL = 'https://sas-fawn-delta.vercel.app';

/**
 * Pages publiées, dans le plan du site. N'y mettre que les pages réellement construites
 * (une adresse qui mène à « Page introuvable » nuit au référencement).
 */
const PAGES = [
  '/',
  '/le-cabinet',
  '/nos-expertises',
  '/expertises/etudes-strategiques',
  '/ia-appliquee',
  '/eclairages',
  '/actualites',
  '/contact',
  '/contact/demande-de-rendez-vous',
  '/contact/rejoindre-notre-reseau',
];

type PageMeta = {
  /** Titre pour Google et pour l'onglet, mot pour mot (le nom du site n'est pas ajouté). */
  title: string;
  /** Description pour Google. */
  description: string;
  /** Titre et description pour les réseaux sociaux (Open Graph). */
  socialTitle: string;
  socialDescription: string;
  /** Image d'aperçu, 1 200 × 630 px, sans texte ajouté (chemin dans public/). */
  image: string;
  imageAlt: string;
};

/**
 * Réglages de référencement par page, repris mot pour mot des cahiers d'OPEM. Le titre de
 * l'onglet est aussi posé par la page elle-même (son `title` dans content.ts) : les garder
 * identiques.
 */
const PAGE_META: Record<string, PageMeta> = {
  '/le-cabinet': {
    title: 'OPEM, cabinet de consulting et de formation à Alger',
    description:
      'Depuis 2019, OPEM conseille et forme les organisations publiques et privées. École de formation agréée à Alger.',
    socialTitle: 'OPEM, une exigence à la hauteur de chaque mission',
    socialDescription:
      'Conseil et formation depuis 2019 : découvrez le cabinet, ses engagements et ses garanties.',
    image: '/images/partage/le-cabinet.jpg',
    imageAlt: 'Un formateur d’OPEM anime une session devant les participants',
  },
  '/nos-expertises': {
    title: 'Six expertises de consulting et de formation à Alger | OPEM',
    description:
      'Six métiers de consulting et de formation, plus une IA appliquée là où elle sert vraiment. Décrivez votre situation : nous vous orientons.',
    socialTitle: 'Chaque enjeu mérite sa propre réponse | OPEM',
    socialDescription:
      'Études, accompagnement, formation, coaching, certification, communication : le bon métier pour chaque enjeu. Parlons de votre projet.',
    // Aucune illustration de la page ne s'y prête (schémas porteurs de mots) : le logo sur fond clair.
    image: '/images/partage/opem-logo-clair.png',
    imageAlt: 'Logo OPEM, Beyond Quality',
  },
};

/** Texte sûr dans un attribut HTML. */
const attr = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

/** Remplace une balise d'index.html, en vérifiant qu'elle y est bien (sinon le build échoue). */
function swap(html: string, pattern: RegExp, replacement: string, page: string) {
  if (!pattern.test(html)) throw new Error(`vite.seo.ts : ${pattern} introuvable pour ${page}`);
  return html.replace(pattern, replacement);
}

/** index.html construit, adapté à une page : ses balises de tête remplacent celles de l'accueil. */
export function pageHtml(html: string, path: string, meta: PageMeta, siteUrl: string) {
  const url = `${siteUrl}${path}`;
  // Les commentaires d'index.html parlent de l'accueil : sans objet ici.
  let out = html.replace(/\s*<!--[\s\S]*?-->/g, '');
  out = swap(out, /<title>[^<]*<\/title>/, `<title>${attr(meta.title)}</title>`, path);
  out = swap(
    out,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${attr(meta.description)}" />`,
    path,
  );
  out = swap(
    out,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${attr(meta.socialTitle)}" />`,
    path,
  );
  out = swap(
    out,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${attr(meta.socialDescription)}" />`,
    path,
  );
  out = swap(
    out,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${attr(`${siteUrl}${meta.image}`)}" />`,
    path,
  );
  out = swap(
    out,
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image:alt" content="${attr(meta.imageAlt)}" />`,
    path,
  );
  // Une seule adresse pour la page : l'adresse canonique et celle des aperçus de liens.
  return out.replace(
    '</head>',
    `  <meta property="og:url" content="${attr(url)}" />\n    <link rel="canonical" href="${attr(url)}" />\n  </head>`,
  );
}

export function seo(): Plugin {
  const siteUrl = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
  let outDir = 'dist';

  return {
    name: 'opem-seo',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
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
    // Une fois index.html écrit (scripts et styles en place), une copie par page référencée.
    writeBundle() {
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8');
      for (const [path, meta] of Object.entries(PAGE_META)) {
        const file = resolve(outDir, `${path.slice(1)}.html`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, pageHtml(html, path, meta, siteUrl));
      }
    },
  };
}
