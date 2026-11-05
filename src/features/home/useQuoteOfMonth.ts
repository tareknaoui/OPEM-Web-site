import { useEffect, useState } from 'react';
import type { Lang } from '@/i18n/language';
import { env } from '@/lib/env';
import { fetchWordPressQuote, type WordPressQuote } from '@/lib/wordpress';
import type { HomeContent } from './content';

// Citations déjà chargées pendant la visite (une requête par langue).
const cache = new Map<Lang, WordPressQuote>();

/**
 * Citation du mois : celle de content.ts s'affiche tout de suite ; elle est remplacée par celle
 * saisie dans WordPress dès qu'elle arrive (si VITE_WP_API_URL est défini). L'étiquette et
 * l'illustration restent celles du site ; source et commentaire suivent WordPress (vides = absents).
 */
export function useQuoteOfMonth(
  lang: Lang,
  fallback: HomeContent['quoteOfMonth'],
): HomeContent['quoteOfMonth'] {
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!env.wpApiUrl || cache.has(lang)) return;
    const controller = new AbortController();

    fetchWordPressQuote(lang, controller.signal)
      .then((quote) => {
        if (!quote) return;
        cache.set(lang, quote);
        setVersion((v) => v + 1);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) console.warn('Citation WordPress indisponible', error);
      });

    return () => controller.abort();
  }, [lang]);

  const fromWordPress = cache.get(lang);
  return fromWordPress ? { ...fallback, ...fromWordPress } : fallback;
}
