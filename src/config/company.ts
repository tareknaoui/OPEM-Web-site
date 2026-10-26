import type { Lang } from '@/i18n/language';

// Coordonnées officielles d'OPEM (source : signatures e-mail OPEM).
// Source unique : pied de page, page Contact, données structurées…
const ADDRESS_FOR_MAPS = '16 rue La Bruyère, Bouzaréah, Alger, Algérie';

export const company = {
  shortName: 'OPEM',
  fullName: 'Optimum Performance Management',
  phone: { display: '06 61 11 94 23', href: 'tel:+213661119423' },
  email: 'general@opem-dz.com',
  address: {
    fr: '16, rue La Bruyère, Bouzaréah, Alger',
    ar: '16، شارع لا برويير، بوزريعة، الجزائر العاصمة',
  } satisfies Record<Lang, string>,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_FOR_MAPS)}`,
} as const;
