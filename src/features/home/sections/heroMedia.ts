// Vidéo d'accueil : montage de 5 plans libres de droits (Pexels), tous dans l'univers d'un
// cabinet (conseil, travail d'équipe, formation, séminaire), en attendant un tournage au cabinet.
// « ?v= » : à augmenter quand on remplace le fichier sous le même nom, pour que les
// navigateurs qui ont gardé l'ancienne version la rechargent.
export const HERO_VIDEO_SRC = '/videos/hero-opem.mp4?v=5';
/** Même montage en 854 × 480 (450 Ko au lieu de 1,4 Mo), pour les écrans de téléphone. */
export const HERO_VIDEO_MOBILE_SRC = '/videos/hero-opem-mobile.mp4?v=1';
export const HERO_POSTER_SRC = '/videos/hero-opem.webp';

/** Écrans où la version légère de la vidéo suffit (la vidéo y occupe toute la largeur). */
export const HERO_VIDEO_MOBILE_QUERY = '(max-width: 47.99em)';

/**
 * La vidéo est lue sur tous les écrans, mobile compris (version légère), comme sur les sites
 * des grands cabinets, sauf si l'utilisateur a demandé à réduire les animations : image fixe
 * alors (aucun téléchargement vidéo).
 */
export const HERO_VIDEO_QUERY = '(prefers-reduced-motion: no-preference)';
