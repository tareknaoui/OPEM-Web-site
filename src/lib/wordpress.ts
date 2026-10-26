import type { Lang } from '@/i18n/language';
import { env } from './env';
import { http } from './http';

export type MenuItem = {
  id: string;
  label: string;
  /** Libellé court pour la barre desktop (champ « Attribut de titre » de WordPress). */
  shortLabel?: string;
  /** Chemin interne (« /expertises ») ou URL externe. Absent = entrée non cliquable. */
  href?: string;
  /** Courte description affichée dans le méga-menu (champ « Description » de WordPress). */
  description?: string;
  children: MenuItem[];
};

/**
 * Lit le menu défini dans WordPress (Apparence > Menus), exposé par le plugin
 * wordpress/opem-menu-api.php. La réponse vient d'un serveur externe : elle est
 * entièrement revalidée ici (forme, longueur des textes, protocole des liens).
 */
export async function fetchWordPressMenu(lang: Lang, signal?: AbortSignal): Promise<MenuItem[]> {
  if (!env.wpApiUrl) return [];
  const data = await http<unknown>(`/opem/v1/menu?lang=${lang}`, {
    baseUrl: env.wpApiUrl,
    credentials: 'omit',
    signal,
  });
  return parseItems(data, 0);
}

const MAX_DEPTH = 2; // sous-menu + un niveau de sous-pages (ex. « Diagnostic d'entreprise »)
const MAX_LABEL_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 160;

function parseItems(data: unknown, depth: number): MenuItem[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap((node): MenuItem[] => {
    if (typeof node !== 'object' || node === null) return [];
    const { id, label, short, url, description, children } = node as Record<string, unknown>;
    if (typeof id !== 'number' || typeof label !== 'string' || label.trim() === '') return [];
    const text = typeof description === 'string' ? description.trim() : '';
    const shortText = typeof short === 'string' ? short.trim() : '';

    return [
      {
        id: `wp-${id}`,
        label: label.trim().slice(0, MAX_LABEL_LENGTH),
        shortLabel: shortText ? shortText.slice(0, MAX_LABEL_LENGTH) : undefined,
        href: typeof url === 'string' ? toSafeHref(url) : undefined,
        description: text ? text.slice(0, MAX_DESCRIPTION_LENGTH) : undefined,
        children: depth < MAX_DEPTH ? parseItems(children, depth + 1) : [],
      },
    ];
  });
}

/**
 * - « # » ou vide : entrée non cliquable (parent de sous-menu) ;
 * - lien vers ce site ou vers WordPress : converti en chemin interne (« /expertises ») ;
 * - autre lien http(s) : conservé tel quel ;
 * - tout autre protocole (javascript:, data:…) : refusé.
 */
export function toSafeHref(url: string): string | undefined {
  if (url.trim() === '' || url.trim() === '#') return undefined;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return undefined;

    const internalOrigins = [window.location.origin];
    if (env.wpApiUrl) internalOrigins.push(new URL(env.wpApiUrl, window.location.origin).origin);

    if (internalOrigins.includes(parsed.origin)) {
      const path = parsed.pathname.replace(/\/+$/, '') || '/';
      return `${path}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return undefined;
  }
}
