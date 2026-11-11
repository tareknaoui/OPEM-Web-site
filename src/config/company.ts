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
  /**
   * Adresse à laquelle exercer ses droits sur ses données (loi n° 18-07) : celle de toutes les
   * mentions des formulaires et de la politique de confidentialité.
   */
  privacyEmail: 'contact@opem-dz.com',
  /** Gérante, directrice de la publication et déléguée à la protection des données. */
  manager: { fr: 'Mme Houda Bourahla', ar: 'السيدة هدى بورحلة' } satisfies Record<Lang, string>,
  /** Agrément de l'établissement de formation (page « Le cabinet », garanties). */
  approval: { number: '539', date: { fr: '24 décembre 2019', ar: '24 ديسمبر 2019' } },
} as const;

/**
 * Identité légale, pour les mentions légales. `null` = à fournir par OPEM : la page affiche
 * « à compléter » à la place (rien n'est inventé). Renseigner chaque valeur telle qu'elle figure
 * sur l'extrait du registre du commerce et le contrat de l'hébergeur.
 */
export const legalIdentity: {
  /** Forme juridique, ex. « SARL ». */
  legalForm: string | null;
  /** Capital social, ex. « 1 000 000 DA ». */
  capital: string | null;
  /** Numéro du registre du commerce. */
  rc: string | null;
  /** Numéro d'identification fiscale. */
  nif: string | null;
  /** Numéro d'identification statistique. */
  nis: string | null;
  /** Hébergeur du serveur du site : raison sociale, adresse, site web. */
  host: { name: string; address: string; website: string } | null;
} = {
  legalForm: null,
  capital: null,
  rc: null,
  nif: null,
  nis: null,
  host: null,
};
