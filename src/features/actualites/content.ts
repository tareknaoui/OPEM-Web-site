import type { EclairagesContent } from '@/features/eclairages/content';
import { eclairagesContent } from '@/features/eclairages/content';
import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Actualités ». Les actualités elles-mêmes ne sont pas ici : ce sont celles
 * de l'accueil (homeContent.insights.news), pour qu'une actualité ajoutée à l'accueil paraisse
 * aussi sur cette page. Ici : les textes de la page, et l'image de chaque actualité (par son
 * identifiant). Textes de la page écrits par nous, à faire valider par OPEM ; arabe à relire.
 */

const NB = ' ';

/** Image d'une actualité : photo réelle, ou capture d'écran présentée dans un cadre de navigateur. */
export type NewsMedia = {
  src: string;
  alt: string;
  kind: 'photo' | 'screen';
  /** Rubrique affichée au-dessus du titre. */
  category: string;
};

export type ActualitesContent = {
  title: string;
  masthead: { eyebrow: string; title: string; lead: string; indexLabel: string };
  list: { eyebrow: string; title: string };
  media: Record<string, NewsMedia>;
  /** « En images » : les photos de sessions (public/images/sessions), légendées ; `focus` cadre
   *  la photo dans sa vignette (object-position), pour garder le formateur dans le cadre. */
  gallery: {
    eyebrow: string;
    title: string;
    lead: string;
    photos: { src: string; focus: string; caption: string }[];
  };
  /** L'inscription (composant de la page Éclairages), adaptée aux actualités. */
  subscribe: EclairagesContent['subscribe'];
};

const FR: ActualitesContent = {
  title: 'Actualités',
  masthead: {
    eyebrow: 'Actualités',
    title: 'La vie du cabinet.',
    lead: `Sessions, interventions et partenariats${NB}: ce qui se passe chez OPEM, au fil des mois.`,
    indexLabel: 'Sommaire des actualités',
  },
  list: { eyebrow: 'À la une', title: 'Les dernières nouvelles' },
  media: {
    'formations-decembre': {
      src: '/images/cabinet/ouverture-session',
      alt: 'Un formateur d’OPEM anime une session devant les participants',
      kind: 'photo',
      category: 'Formation qualifiante',
    },
    'nouveau-site': {
      src: '/images/actualites/nouveau-site',
      alt: 'La page d’accueil du nouveau site d’OPEM',
      kind: 'screen',
      category: 'Le cabinet',
    },
  },
  gallery: {
    eyebrow: 'En images',
    title: 'Au cœur de nos sessions.',
    lead: 'Des salles réelles, des participants réels : nos formations telles qu’elles se vivent.',
    photos: [
      {
        src: '/images/sessions/salle-conference',
        focus: '72% 50%',
        caption: 'Une session OPEM : le formateur au tableau, les participants autour de la table',
      },
      {
        src: '/images/sessions/revue-documents',
        focus: '45% 50%',
        caption: 'Des participants à une session OPEM, documents en main',
      },
      {
        src: '/images/sessions/formateur-btph',
        focus: '22% 50%',
        caption: 'Un formateur d’OPEM face aux participants',
      },
    ],
  },
  subscribe: {
    ...eclairagesContent.fr.subscribe,
    title: 'Recevoir nos actualités',
    text: 'Nos nouvelles formations, nos sessions et la vie du cabinet, dès leur annonce.',
  },
};

const AR: ActualitesContent = {
  title: 'الأخبار',
  masthead: {
    eyebrow: 'الأخبار',
    title: 'حياة المكتب.',
    lead: 'دورات ومداخلات وشراكات: ما يجري في OPEM، شهرًا بعد شهر.',
    indexLabel: 'فهرس الأخبار',
  },
  list: { eyebrow: 'في الواجهة', title: 'آخر المستجدات' },
  media: {
    'formations-decembre': {
      src: '/images/cabinet/ouverture-session',
      alt: 'مكوّن من OPEM ينشّط دورة أمام المشاركين',
      kind: 'photo',
      category: 'التكوين التأهيلي',
    },
    'nouveau-site': {
      src: '/images/actualites/nouveau-site',
      alt: 'الصفحة الرئيسية لموقع OPEM الجديد',
      kind: 'screen',
      category: 'المكتب',
    },
  },
  gallery: {
    eyebrow: 'بالصور',
    title: 'في قلب دوراتنا.',
    lead: 'قاعات حقيقية ومشاركون حقيقيون: تكويناتنا كما تُعاش.',
    photos: [
      {
        src: '/images/sessions/salle-conference',
        focus: '72% 50%',
        caption: 'دورة لـ OPEM: المكوِّن أمام السبورة والمشاركون حول الطاولة',
      },
      {
        src: '/images/sessions/revue-documents',
        focus: '45% 50%',
        caption: 'مشاركون في دورة لـ OPEM والوثائق بين أيديهم',
      },
      {
        src: '/images/sessions/formateur-btph',
        focus: '22% 50%',
        caption: 'مكوِّن من OPEM أمام المشاركين',
      },
    ],
  },
  subscribe: {
    ...eclairagesContent.ar.subscribe,
    title: 'تلقّي أخبارنا',
    text: 'تكويناتنا الجديدة ودوراتنا وحياة المكتب، فور الإعلان عنها.',
  },
};

export const actualitesContent: Record<Lang, ActualitesContent> = { fr: FR, ar: AR };
