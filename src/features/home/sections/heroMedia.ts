// Vidéo d'accueil : montage de 4 plans libres de droits (Pexels) — conseil, chantier,
// formation, industrie — en attendant un tournage au cabinet. Partagée par les bandeaux.
export const HERO_VIDEO_SRC = '/videos/hero-opem.mp4';
export const HERO_POSTER_SRC = '/videos/hero-opem.jpg';

/**
 * La vidéo n'est chargée que sur écran moyen ou grand, et si l'utilisateur n'a pas
 * demandé à réduire les animations. Sinon : image fixe (aucun téléchargement vidéo).
 */
export const HERO_VIDEO_QUERY = '(min-width: 48em) and (prefers-reduced-motion: no-preference)';
