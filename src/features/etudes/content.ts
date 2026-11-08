import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Études stratégiques ». Le français est repris mot pour mot du cahier des
 * charges ; seules les espaces insécables sont ajoutées (avant « : », « ; », « ? »). Les blocs
 * 02 à 06 viendront au fur et à mesure. L'arabe est à faire relire par OPEM.
 */

const fr = (text: string) => text.replace(/ ([:;?!])/g, ' $1');

export type EtudesContent = {
  title: string;
  opening: { eyebrow: string; title: string; text: string; alt: string };
};

const FR: EtudesContent = {
  title: 'Études stratégiques',
  opening: {
    eyebrow: 'Études stratégiques',
    title: 'Des études pour fonder les décisions qui comptent.',
    text: fr(
      'Un engagement d’envergure se prend une fois et se vit longtemps. Avant de trancher, vous devez savoir, comprendre et anticiper, non pas supposer. Sources vérifiées, terrain parcouru, calculs ouverts à la relecture : chacune de nos études vous offre cette assise.',
    ),
    alt: 'Un nuage de points dispersés se resserre jusqu’à un seul point',
  },
};

const AR: EtudesContent = {
  title: 'الدراسات الاستراتيجية',
  opening: {
    eyebrow: 'الدراسات الاستراتيجية',
    title: 'دراسات تؤسس للقرارات المهمة.',
    text: 'التزام بهذا الحجم يُتخذ مرة ويُعاش طويلًا. قبل الحسم، عليكم أن تعرفوا وتفهموا وتستبقوا، لا أن تفترضوا. مصادر موثّقة، ميدان مستكشَف، حسابات مفتوحة للمراجعة: كل دراسة من دراساتنا تمنحكم هذا الأساس.',
    alt: 'سحابة من النقاط المتفرقة تتقارب حتى نقطة واحدة',
  },
};

export const etudesContent: Record<Lang, EtudesContent> = { fr: FR, ar: AR };
