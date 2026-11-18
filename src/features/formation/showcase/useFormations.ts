import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '@/i18n/language';
import { env } from '@/lib/env';
import { findShowcase, type TrainingShowcase } from './content';
import { fetchWordPressFormations, type Session, type WordPressFormation } from './wordpress';

/*
 * Les formations saisies dans WordPress (menu « Formations »), en plus de celles écrites dans
 * le site (content.ts) : même modèle de page, et leur session rejoint l'agenda. Une formation
 * WordPress de même adresse remplace celle du site (textes corrigés dans WordPress). Sans
 * WordPress (VITE_WP_API_URL vide) ou s'il ne répond pas : les formations du site seules.
 */

// Formations déjà chargées pendant la visite (une requête par langue), et langues en échec.
const cache = new Map<Lang, WordPressFormation[]>();
const failed = new Set<Lang>();
const pending = new Map<Lang, Promise<void>>();
const listeners = new Set<() => void>();

function load(lang: Lang) {
  if (!env.wpApiUrl || cache.has(lang) || failed.has(lang)) return;
  if (pending.has(lang)) return;
  const request = fetchWordPressFormations(lang)
    .then((formations) => {
      cache.set(lang, formations);
    })
    .catch((error: unknown) => {
      failed.add(lang);
      console.warn('Formations WordPress indisponibles', error);
    })
    .finally(() => {
      pending.delete(lang);
      listeners.forEach((listener) => listener());
    });
  pending.set(lang, request);
}

/** Les formations WordPress de la langue, et si la réponse est arrivée (ou inutile). */
export function useWordPressFormations(lang: Lang) {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const listener = () => setVersion((v) => v + 1);
    listeners.add(listener);
    load(lang);
    return () => {
      listeners.delete(listener);
    };
  }, [lang]);

  const ready = !env.wpApiUrl || cache.has(lang) || failed.has(lang);
  return { formations: cache.get(lang) ?? [], ready };
}

/**
 * La page de la formation d'adresse `id` : celle de WordPress si elle existe, sinon celle du
 * site. `ready` : faux tant que WordPress n'a pas répondu et que le site n'a pas cette page.
 */
export function useShowcase(
  lang: Lang,
  id: string | undefined,
): { item: TrainingShowcase | undefined; ready: boolean } {
  const { formations, ready } = useWordPressFormations(lang);
  const fromWordPress = formations.find((formation) => formation.showcase.id === id)?.showcase;
  const builtIn = findShowcase(lang, id);
  return { item: fromWordPress ?? builtIn, ready: ready || Boolean(builtIn) };
}

/** L'agenda : les sessions du site, complétées (ou remplacées, même `id`) par celles de WordPress. */
export function useAgenda(lang: Lang, items: Session[]): Session[] {
  const { formations } = useWordPressFormations(lang);
  return useMemo(() => {
    const sessions = formations.flatMap((formation) =>
      formation.session ? [formation.session] : [],
    );
    if (sessions.length === 0) return items;
    const ids = new Set(sessions.map((session) => session.id));
    return [...items.filter((item) => !ids.has(item.id)), ...sessions].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }, [formations, items]);
}

/** Vrai si la formation a sa page (dans le site ou dans WordPress). */
export function useHasShowcase(lang: Lang) {
  const { formations } = useWordPressFormations(lang);
  return (id: string) =>
    Boolean(findShowcase(lang, id)) || formations.some((formation) => formation.showcase.id === id);
}
