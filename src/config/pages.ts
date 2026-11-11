/**
 * Pages réellement construites. Source unique : le plan du site (sitemap.xml, vite.seo.ts) et
 * la page « Plan du site » n'affichent que celles-ci : une adresse qui mène à « Page
 * introuvable » nuit au référencement et aux visiteurs. Ajouter ici toute nouvelle page.
 *
 * Fichier sans dépendance : il est lu aussi au build (vite.seo.ts, tsconfig.node.json).
 */
export const PUBLISHED_PAGES = [
  '/',
  '/le-cabinet',
  '/nos-expertises',
  '/expertises/etudes-strategiques',
  '/expertises/accompagnement-des-organisations',
  '/expertises/coaching-professionnel',
  '/expertises/certification-et-accreditation',
  '/expertises/communication-institutionnelle',
  '/formation',
  '/missions',
  '/ia-appliquee',
  '/eclairages',
  '/actualites',
  '/contact',
  '/contact/demande-de-rendez-vous',
  '/contact/rejoindre-notre-reseau',
  '/mentions-legales',
  '/confidentialite',
  '/plan-du-site',
] as const;

/**
 * Rubriques dont les sous-adresses sont servies par la page de la rubrique (voir router.tsx :
 * « formation/* », « missions/* », « expertises/:domain/* ») : elles descendent jusqu'au bloc
 * demandé, sans page à part dans sitemap.xml.
 */
const SECTION_PREFIXES = ['/formation/', '/missions/', '/expertises/'];

/** Vrai si l'adresse interne mène à une vraie page (et non à « Page introuvable »). */
export function isPublished(href: string): boolean {
  const path = href.split(/[?#]/)[0] ?? '';
  return (
    (PUBLISHED_PAGES as readonly string[]).includes(path) ||
    SECTION_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}
