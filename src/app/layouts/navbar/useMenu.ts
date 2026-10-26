import { useEffect, useState } from 'react';
import type { Lang } from '@/i18n/language';
import { env } from '@/lib/env';
import { fetchWordPressMenu } from '@/lib/wordpress';
import { fallbackMenus, MAX_TOP_LEVEL_ITEMS, type MenuItem } from './menu';

// Menus déjà chargés pendant la visite, et requêtes en cours : la barre de navigation
// et le pied de page partagent ainsi un seul appel à WordPress par langue.
const cache = new Map<Lang, MenuItem[]>();
const inFlight = new Map<Lang, Promise<MenuItem[]>>();

function loadMenu(lang: Lang): Promise<MenuItem[]> {
  let request = inFlight.get(lang);
  if (!request) {
    request = fetchWordPressMenu(lang)
      .then((items) => {
        if (items.length > 0) cache.set(lang, items);
        return items;
      })
      .finally(() => inFlight.delete(lang));
    inFlight.set(lang, request);
  }
  return request;
}

/**
 * Renvoie le menu de la langue demandée. Le menu intégré s'affiche tout de suite ;
 * il est remplacé par celui de WordPress dès qu'il arrive (si VITE_WP_API_URL est défini).
 */
export function useMenu(lang: Lang): MenuItem[] {
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!env.wpApiUrl || cache.has(lang)) return;
    let active = true;

    loadMenu(lang)
      .then((items) => {
        if (active && items.length > 0) setVersion((v) => v + 1);
      })
      .catch((error: unknown) => console.warn('Menu WordPress indisponible', error));

    return () => {
      active = false;
    };
  }, [lang]);

  return (cache.get(lang) ?? fallbackMenus[lang]).slice(0, MAX_TOP_LEVEL_ITEMS);
}
