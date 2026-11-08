import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Contact ». Aucun cahier des charges pour cette page : textes proposés, à
 * valider par OPEM (les intitulés des deux portes reprennent ceux du menu Contact). L'arabe est
 * à faire relire. Coordonnées : src/config/company.ts (source unique, comme le pied de page).
 */

const NBSP = ' ';

export type ContactContent = {
  eyebrow: string;
  title: string;
  intro: string;
  doorsTitle: string;
  doors: {
    appointment: { title: string; text: string; cta: string };
    join: { title: string; text: string; cta: string };
  };
  details: {
    title: string;
    phone: string;
    email: string;
    address: string;
    call: (phone: string) => string;
    directions: string;
    newTab: string;
  };
  mapTitle: (address: string) => string;
};

const fr: ContactContent = {
  eyebrow: 'Contact',
  title: 'Nous contacter',
  intro:
    'Un projet, une question, une candidature : écrivez-nous, appelez-nous, ou choisissez le formulaire qui vous correspond.',
  doorsTitle: 'Deux formulaires pour aller droit au but',
  doors: {
    appointment: {
      title: 'Demande de rendez-vous',
      text: 'Échanger avec un consultant OPEM.',
      cta: 'Parlons de votre projet',
    },
    join: {
      title: 'Rejoindre notre réseau',
      text: 'Consultants et formateurs : proposez votre candidature.',
      cta: 'Rejoindre notre réseau',
    },
  },
  details: {
    title: 'Nos coordonnées',
    phone: 'Téléphone',
    email: 'Courriel',
    address: 'Adresse',
    call: (phone) => `Appeler le ${phone}`,
    directions: 'Obtenir l’itinéraire',
    newTab: '(nouvel onglet)',
  },
  mapTitle: (address) => `Carte${NBSP}: OPEM, ${address}`,
};

const ar: ContactContent = {
  eyebrow: 'اتصل بنا',
  title: 'تواصلوا معنا',
  intro: 'مشروع أو سؤال أو ترشح: راسلونا أو اتصلوا بنا، أو اختاروا الاستمارة التي تناسبكم.',
  doorsTitle: 'استمارتان للوصول مباشرة إلى الهدف',
  doors: {
    appointment: {
      title: 'طلب موعد',
      text: 'تحدثوا مع أحد مستشاري OPEM.',
      cta: 'لنتحدث عن مشروعكم',
    },
    join: {
      title: 'انضموا إلى شبكتنا',
      text: 'مستشارون ومكوّنون: قدّموا ترشحكم.',
      cta: 'انضموا إلى شبكتنا',
    },
  },
  details: {
    title: 'عناويننا',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    call: (phone) => `اتصل بالرقم ${phone}`,
    directions: 'الحصول على المسار',
    newTab: '(نافذة جديدة)',
  },
  mapTitle: (address) => `خريطة: OPEM، ${address}`,
};

export const contactContent: Record<Lang, ContactContent> = { fr, ar };
