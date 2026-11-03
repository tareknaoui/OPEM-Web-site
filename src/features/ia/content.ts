import type { Lang } from '@/i18n/language';

/**
 * Textes propres à la page « IA appliquée ». Le reste (titre, présentation, trois temps) vient
 * du bloc IA de l'accueil, en attendant le texte complet d'OPEM (Notion).
 */
export const iaContent: Record<Lang, { title: string; eyebrow: string; cta: string }> = {
  fr: {
    title: 'IA appliquée · OPEM',
    eyebrow: 'IA appliquée',
    cta: 'Parlons de votre projet',
  },
  ar: {
    title: 'الذكاء الاصطناعي التطبيقي · OPEM',
    eyebrow: 'الذكاء الاصطناعي التطبيقي',
    cta: 'لنتحدث عن مشروعكم',
  },
};
