import type { Lang } from '@/i18n/language';

// Coordonnées officielles d'OPEM (source : signatures e-mail OPEM).
// Source unique : pied de page, page Contact, données structurées…
/**
 * Ce que cherchent les cartes (lien du pied de page, carte de la page Contact) : la fiche
 * Google d'OPEM, plus sûre que l'adresse (la rue La Bruyère n'est pas connue des cartes).
 */
export const MAPS_QUERY = 'OPEM - Optimum Performance Management, Bouzaréah, Alger';

export const company = {
  shortName: 'OPEM',
  fullName: 'Optimum Performance Management',
  phone: { display: '06 61 11 94 23', href: 'tel:+213661119423' },
  email: 'general@opem-dz.com',
  address: {
    fr: '16, rue La Bruyère, Bouzaréah, Alger',
    ar: '16، شارع لا برويير، بوزريعة، الجزائر العاصمة',
  } satisfies Record<Lang, string>,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`,
} as const;
