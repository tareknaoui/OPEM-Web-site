import type { HomeContent } from '@/features/home/content';
import type { Lang } from '@/i18n/language';
import { env } from '@/lib/env';
import { http } from '@/lib/http';
import { toSafeHref } from '@/lib/wordpress';
import { findShowcase, SHOWCASE_IDS, type TrainingShowcase } from './content';
import { frenchSpaces } from './dates';

export type Session = HomeContent['trainings']['items'][number];

/** Une formation saisie dans WordPress : sa page, et sa session dans l'agenda (si datée). */
export type WordPressFormation = { showcase: TrainingShowcase; session: Session | null };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ITEMS = 100;

/**
 * Lit les formations publiées dans WordPress (menu « Formations »), exposées par le plugin
 * wordpress/opem-formations-api.php. La réponse vient d'un serveur externe : elle est
 * entièrement revalidée (forme, longueurs, adresses, dates) ; une entrée incomplète est écartée.
 */
export async function fetchWordPressFormations(
  lang: Lang,
  signal?: AbortSignal,
): Promise<WordPressFormation[]> {
  if (!env.wpApiUrl) return [];
  const data = await http<unknown>(`/opem/v1/formations?lang=${lang}`, {
    baseUrl: env.wpApiUrl,
    credentials: 'omit',
    signal,
  });
  return parseFormations(data, lang);
}

export function parseFormations(data: unknown, lang: Lang): WordPressFormation[] {
  if (!Array.isArray(data)) return [];
  const seen = new Set<string>();
  const formations: WordPressFormation[] = [];
  for (const entry of data.slice(0, MAX_ITEMS)) {
    const formation = parseFormation(entry, lang);
    if (!formation || seen.has(formation.showcase.id)) continue;
    seen.add(formation.showcase.id);
    formations.push(formation);
  }
  return formations;
}

function parseFormation(entry: unknown, lang: Lang): WordPressFormation | null {
  if (typeof entry !== 'object' || entry === null) return null;
  const fields = entry as Record<string, unknown>;
  const typo = (value: string) => (lang === 'fr' ? frenchSpaces(value) : value);
  const text = (key: string, max: number) => {
    const value = fields[key];
    return typeof value === 'string' ? typo(value.trim().slice(0, max)) : '';
  };
  const list = (key: string, max: number) => {
    const value = fields[key];
    if (!Array.isArray(value)) return [];
    return value
      .filter((line): line is string => typeof line === 'string' && line.trim() !== '')
      .slice(0, 6)
      .map((line) => typo(line.trim().slice(0, max)));
  };

  const id = text('id', 80);
  const title = text('title', 160);
  const promise = text('promise', 200);
  const whyText = text('whyText', 1500);
  if (!SLUG.test(id) || !title || !promise || !whyText) return null;

  // L'illustration : l'une de celles des pages existantes (thème choisi dans WordPress).
  const theme = text('theme', 80);
  const preset = findShowcase(lang, SHOWCASE_IDS.includes(theme) ? theme : SHOWCASE_IDS[0]);
  if (!preset) return null;
  const art = preset.illustration.art ?? preset.id;

  const seatsValue = Number(fields.seats);
  const seats =
    Number.isInteger(seatsValue) && seatsValue > 0 && seatsValue < 1000 ? seatsValue : 12;
  const city = text('city', 80) || preset.city;
  const duration = text('duration', 40);
  const href = `/formation/fiches-formation/${id}`;
  const linkHref = toSafeHref(text('linkHref', 300)) ?? '/formation';

  const voices = Array.isArray(fields.voices)
    ? fields.voices
        .slice(0, 3)
        .map((voice) => {
          if (typeof voice !== 'object' || voice === null) return null;
          const { quote, author } = voice as Record<string, unknown>;
          if (typeof quote !== 'string' || quote.trim() === '') return null;
          return {
            quote: typo(quote.trim().slice(0, 600)),
            author:
              typeof author === 'string' && author.trim() ? typo(author.trim().slice(0, 120)) : '',
          };
        })
        .filter((voice) => voice !== null)
    : [];

  const showcase: TrainingShowcase = {
    id,
    reference: text('reference', 40),
    cycle: text('cycle', 80),
    title,
    hook: { question: text('hookQuestion', 300), answer: text('hookAnswer', 200) },
    promise,
    duration,
    seats,
    place: text('place', 80) || preset.place,
    city,
    illustration: { ...preset.illustration, art, alt: text('alt', 400) || preset.illustration.alt },
    why: {
      text: whyText,
      details: text('whyDetails', 1500) || undefined,
      edge: text('whyEdge', 1000),
      link: text('linkLabel', 200) ? { label: text('linkLabel', 200), href: linkHref } : undefined,
    },
    gains: list('gains', 400),
    audience: text('audience', 600),
    reasons: list('reasons', 300),
    voices,
  };

  // L'agenda : seulement une session datée (premier et dernier jour valides, dans l'ordre).
  const start = text('start', 10);
  const end = text('end', 10) || start;
  const session: Session | null =
    DAY.test(start) && DAY.test(end) && end >= start
      ? {
          id,
          date: start,
          end,
          topic: text('topic', 80) || showcase.cycle,
          title,
          promise: promise.replace(/[.;]\s*$/, ''),
          format: text('format', 120) || [city, duration].filter(Boolean).join(' · '),
          href,
        }
      : null;

  return { showcase, session };
}
