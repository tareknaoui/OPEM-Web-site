import type { Lang } from '@/i18n/language';

/** Date d'une publication (AAAA-MM-JJ), écrite en toutes lettres : « 14 octobre 2026 ». */
export function formatInsightDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-DZ' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}
