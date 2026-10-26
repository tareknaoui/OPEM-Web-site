// Vidéo d'accueil (ruche), partagée par les bandeaux « Vidéo » et « Immersif ».
export const HERO_VIDEO_SRC = '/videos/hero-ruche.mp4';
export const HERO_POSTER_SRC = '/videos/hero-ruche.jpg';

/**
 * La vidéo n'est chargée que sur écran moyen ou grand, et si l'utilisateur n'a pas
 * demandé à réduire les animations. Sinon : image fixe (aucun téléchargement vidéo).
 */
export const HERO_VIDEO_QUERY = '(min-width: 48em) and (prefers-reduced-motion: no-preference)';
