// Vidéo d'accueil : montage de 4 plans libres de droits (Pexels) — conseil, chantier,
// formation, industrie — en attendant un tournage au cabinet. Partagée par les bandeaux.
// « ?v= » : à augmenter quand on remplace le fichier sous le même nom, pour que les
// navigateurs qui ont gardé l'ancienne version la rechargent.
export const HERO_VIDEO_SRC = '/videos/hero-opem.mp4?v=3';
export const HERO_POSTER_SRC = '/videos/hero-opem.jpg';

/**
 * La vidéo (1,7 Mo) est lue sur tous les écrans, mobile compris, comme sur les sites des
 * grands cabinets, sauf si l'utilisateur a demandé à réduire les animations : image fixe
 * alors (aucun téléchargement vidéo).
 */
export const HERO_VIDEO_QUERY = '(prefers-reduced-motion: no-preference)';
