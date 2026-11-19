import type { Lang } from '@/i18n/language';

/*
 * Pages des domaines d'expertise (/expertises/<domaine>), hors « Études stratégiques »,
 * « Coaching professionnel », « Certification et accréditation », « Communication
 * institutionnelle » (pages à part) et « Formation qualifiante » (/formation). Les textes du
 * domaine (accroche, présentation, prestations, référence) viennent de « Nos expertises »
 * (expertisesContent : une seule source) ; la démarche, de la page « Le cabinet » ; les missions, de « Missions et réalisations ». Ici :
 * les photos de chaque domaine et les mots communs aux pages. L'arabe est à faire relire.
 */

export const DOMAIN_PAGES = ['accompagnement-des-organisations'] as const;
export type DomainPageId = (typeof DOMAIN_PAGES)[number];

type Photo = { small: string; large?: string; width: number; height: number };
type Alt = Record<Lang, string>;

/** Les deux photos d'un domaine : celle de l'en-tête, puis une grande, au milieu de la page. */
export const DOMAIN_PHOTOS: Record<
  DomainPageId,
  { hero: Photo & { alt: Alt }; wide: Photo & { alt: Alt } }
> = {
  'accompagnement-des-organisations': {
    hero: {
      small: '/images/expertises/relais-accompagnement-700.webp',
      large: '/images/expertises/relais-accompagnement.webp',
      width: 700,
      height: 525,
      alt: {
        fr: 'Un atelier : une équipe organise des notes adhésives sur une paroi vitrée',
        ar: 'ورشة عمل: فريق يرتّب ملاحظات لاصقة على جدار زجاجي',
      },
    },
    wide: {
      small: '/images/actualites/salle-reunion.webp',
      width: 1280,
      height: 720,
      alt: {
        fr: 'Une salle de réunion lumineuse, un tableau blanc couvert de schémas au mur',
        ar: 'قاعة اجتماعات مضيئة، وعلى الجدار سبورة بيضاء مليئة بالمخططات',
      },
    },
  },
};

/** Les mots communs aux pages des domaines. */
export type DomainLabels = {
  breadcrumb: { label: string; href: string };
  contact: { label: string };
  cases: { label: string; href: string };
  services: { eyebrow: string; title: string };
  method: { eyebrow: string };
  references: { eyebrow: string; title: string; all: string };
};

export const domainLabels: Record<Lang, DomainLabels> = {
  fr: {
    breadcrumb: { label: 'Nos expertises', href: '/nos-expertises' },
    contact: { label: 'Parlons de votre projet' },
    cases: { label: 'Voir nos études de cas', href: '/missions' },
    services: { eyebrow: 'Ce que nous faisons', title: 'Nos prestations' },
    method: { eyebrow: 'Notre démarche' },
    references: {
      eyebrow: 'Références',
      title: 'Ils nous ont fait confiance.',
      all: 'Toutes nos études de cas',
    },
  },
  ar: {
    breadcrumb: { label: 'خبراتنا', href: '/nos-expertises' },
    contact: { label: 'لنتحدث عن مشروعكم' },
    cases: { label: 'اطّلعوا على دراسات الحالة', href: '/missions' },
    services: { eyebrow: 'ما نقوم به', title: 'خدماتنا' },
    method: { eyebrow: 'منهجيتنا' },
    references: {
      eyebrow: 'مراجع',
      title: 'وضعوا ثقتهم فينا.',
      all: 'كل دراسات الحالة',
    },
  },
};
