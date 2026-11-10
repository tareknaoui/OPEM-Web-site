import type { Lang } from '@/i18n/language';

/*
 * Pages des domaines d'expertise (/expertises/<domaine>), hors « Études stratégiques » (page à
 * part) et « Formation qualifiante » (/formation). Les textes du domaine (accroche, présentation,
 * prestations, référence) viennent de « Nos expertises » (expertisesContent : une seule source) ;
 * la démarche, de la page « Le cabinet » ; les missions, de « Missions et réalisations ». Ici :
 * les photos de chaque domaine et les mots communs aux pages. L'arabe est à faire relire.
 */

export const DOMAIN_PAGES = [
  'accompagnement-des-organisations',
  'coaching-professionnel',
  'communication-institutionnelle',
  'certification-et-accreditation',
] as const;
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
  'coaching-professionnel': {
    hero: {
      small: '/images/domaines/coaching-700.webp',
      large: '/images/domaines/coaching.webp',
      width: 1280,
      height: 960,
      alt: {
        fr: 'Un dirigeant penché sur un bureau échange avec une collaboratrice devant ses documents',
        ar: 'مسيّر منحنٍ على مكتب يتحاور مع زميلة أمام وثائقها',
      },
    },
    wide: {
      small: '/images/actualites/bureau.webp',
      width: 1280,
      height: 720,
      alt: {
        fr: 'Un bureau de direction calme, face à une grande baie vitrée',
        ar: 'مكتب إدارة هادئ أمام واجهة زجاجية كبيرة',
      },
    },
  },
  'communication-institutionnelle': {
    hero: {
      small: '/images/expertises/relais-communication-700.webp',
      large: '/images/expertises/relais-communication.webp',
      width: 700,
      height: 525,
      alt: {
        fr: 'Deux personnes feuillettent un catalogue imprimé, à côté d’un ordinateur portable et d’un nuancier',
        ar: 'شخصان يتصفّحان دليلًا مطبوعًا بجانب حاسوب محمول ولوحة ألوان',
      },
    },
    wide: {
      small: '/images/actualites/nouveau-site-700.webp',
      large: '/images/actualites/nouveau-site.webp',
      width: 700,
      height: 438,
      alt: {
        fr: 'La page d’accueil du site d’OPEM, conçu par nos équipes',
        ar: 'الصفحة الرئيسية لموقع OPEM، من تصميم فرقنا',
      },
    },
  },
  'certification-et-accreditation': {
    hero: {
      small: '/images/expertises/relais-certification-700.webp',
      large: '/images/expertises/relais-certification.webp',
      width: 700,
      height: 525,
      alt: {
        fr: 'Une ingénieure en casque de chantier consulte une liste de contrôle sur un site industriel',
        ar: 'مهندسة بخوذة ورشة تراجع قائمة تدقيق في موقع صناعي',
      },
    },
    wide: {
      small: '/images/cabinet/garanties-session-1200.webp',
      large: '/images/cabinet/garanties-session.webp',
      width: 1200,
      height: 514,
      alt: {
        fr: 'Une session de travail OPEM : des participants autour de tables, documents en main',
        ar: 'جلسة عمل لـ OPEM: مشاركون حول طاولات والوثائق بين أيديهم',
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
