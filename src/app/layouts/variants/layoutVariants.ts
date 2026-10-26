import { useSyncExternalStore } from 'react';

/* ==========================================================================
   Maquettes à comparer (barre de navigation et pied de page).
   Outil de présentation : la version 1 reste la version par défaut du site.
   Une fois le choix fait, garder la variante retenue et supprimer les autres
   (ce dossier, le sélecteur et les variantes non retenues).

   Le sélecteur s'affiche :
   - toujours en développement (npm run dev) ;
   - en production seulement avec ?maquettes dans l'adresse.
   Lien direct vers une combinaison : /?maquettes&nav=blanche&footer=clair&domaines=carrousel&eclairages=rail
   ========================================================================== */

export const navbarVariants = [
  { id: 'nuit', label: 'Bleu nuit', description: 'Version actuelle' },
  { id: 'blanche', label: 'Blanche', description: 'Fond blanc, logo couleur' },
  {
    id: 'editoriale',
    label: 'Éditoriale',
    description: 'Blanche et aérée, sous-menus pleine largeur',
  },
  {
    id: 'editorialenuit',
    label: 'Éditoriale bleu nuit',
    description: 'La même sur bleu nuit, logo blanc',
  },
  { id: 'flottante', label: 'Capsule flottante', description: 'Barre arrondie détachée des bords' },
  { id: 'centree', label: 'Logo centré', description: 'Logo au centre, menu sur bande bleu nuit' },
  { id: 'pleinecran', label: 'Plein écran', description: 'Bouton « Menu », grand menu éditorial' },
  {
    id: 'prestige',
    label: 'Prestige bleu nuit',
    description: 'L’éditoriale bleu nuit avec un méga-menu riche',
  },
] as const;

export const footerVariants = [
  { id: 'nuit', label: 'Bleu nuit', description: 'Version actuelle' },
  { id: 'clair', label: 'Clair', description: 'Fond bleu très clair, logo couleur' },
  { id: 'compact', label: 'Compact', description: 'Une seule bande, l’essentiel' },
] as const;

export const heroVariants = [
  { id: 'reseau', label: 'Réseau 3D', description: 'Version actuelle' },
  { id: 'cycle', label: 'Cycle OPEM', description: 'Grand titre, démarche animée en 3 étapes' },
  { id: 'video', label: 'Vidéo ruche', description: 'Vidéo plein cadre, texte sur bleu nuit' },
  {
    id: 'immersive',
    label: 'Vidéo immersive',
    description: 'Grand cadre arrondi, titre centré, carte « besoin »',
  },
  {
    id: 'editorial',
    label: 'Éditorial cabinet',
    description: 'Très grand titre, vidéo en fenêtre légendée, 3 métiers',
  },
  {
    id: 'editorialnuit',
    label: 'Éditorial bleu nuit',
    description: 'Le même en couleurs inversées : fond bleu nuit, textes blancs',
  },
  {
    id: 'diagnostic',
    label: 'Autodiagnostic',
    description: 'Sur bleu nuit, 1re question du diagnostic et 4 réponses, vidéo à droite',
  },
  {
    id: 'questions',
    label: 'Trois questions',
    description: 'Sur bleu nuit, trois questions-liens à la place du titre, vidéo à droite',
  },
  {
    id: 'publics',
    label: 'Public / entreprise',
    description: 'Sur bleu nuit, titre puis deux grands blocs : organisme public, entreprise',
  },
  {
    id: 'reperes',
    label: 'Repères',
    description: 'Sur bleu nuit, boutons puis trois faits courts (à confirmer), vidéo à droite',
  },
] as const;

export const domainsVariants = [
  { id: 'onglets', label: 'Onglets', description: 'Onglets, panneau blanc, précédent / suivant' },
  {
    id: 'carrousel',
    label: 'Carrousel à panneaux',
    description: 'Bandes bleu nuit qui s’ouvrent en grand panneau, barre d’avancement',
  },
  {
    id: 'anime',
    label: 'Carrousel animé',
    description: 'Fond bleu OPEM, défile seul (avec pause), onglets à barre de progression',
  },
  {
    id: 'sommaire',
    label: 'Sommaire éditorial',
    description: 'Bleu nuit, sommaire numéroté | grande photo, défile seul (avec pause)',
  },
] as const;

export const insightsVariants = [
  {
    id: 'une',
    label: 'À la une',
    description: 'Fond blanc, une grande publication, deux compactes et trois cartes',
  },
  {
    id: 'rail',
    label: 'Rail défilant',
    description: 'Fond bleu clair, cartes blanches qui défilent, flèches et barre d’avancement',
  },
] as const;

export type NavbarVariant = (typeof navbarVariants)[number]['id'];
export type FooterVariant = (typeof footerVariants)[number]['id'];
export type HeroVariant = (typeof heroVariants)[number]['id'];
export type DomainsVariant = (typeof domainsVariants)[number]['id'];
export type InsightsVariant = (typeof insightsVariants)[number]['id'];
export type LayoutVariants = {
  navbar: NavbarVariant;
  footer: FooterVariant;
  hero: HeroVariant;
  domains: DomainsVariant;
  insights: InsightsVariant;
};

const DEFAULTS: LayoutVariants = {
  navbar: 'nuit',
  footer: 'nuit',
  hero: 'reseau',
  domains: 'onglets',
  insights: 'une',
};
const STORAGE_KEY = 'opem-maquettes';
const FLAG_KEY = 'opem-maquettes-actif';

const isNavbar = (v: unknown): v is NavbarVariant => navbarVariants.some((o) => o.id === v);
const isFooter = (v: unknown): v is FooterVariant => footerVariants.some((o) => o.id === v);
const isHero = (v: unknown): v is HeroVariant => heroVariants.some((o) => o.id === v);
const isDomains = (v: unknown): v is DomainsVariant => domainsVariants.some((o) => o.id === v);
const isInsights = (v: unknown): v is InsightsVariant => insightsVariants.some((o) => o.id === v);

function readFlag(params: URLSearchParams) {
  try {
    if (params.has('maquettes')) sessionStorage.setItem(FLAG_KEY, '1');
    return sessionStorage.getItem(FLAG_KEY) === '1';
  } catch {
    return params.has('maquettes');
  }
}

const params = new URLSearchParams(window.location.search);

/** Le comparateur est-il actif (développement ou ?maquettes) ? */
export const variantsEnabled = import.meta.env.DEV || readFlag(params);

function readStored(): Partial<LayoutVariants> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<LayoutVariants>;
  } catch {
    return {};
  }
}

function load(): LayoutVariants {
  if (!variantsEnabled) return DEFAULTS;
  const stored = readStored();
  const nav = params.get('nav') ?? stored.navbar;
  const footer = params.get('footer') ?? stored.footer;
  const hero = params.get('hero') ?? stored.hero;
  const domains = params.get('domaines') ?? stored.domains;
  const insights = params.get('eclairages') ?? stored.insights;
  return {
    navbar: isNavbar(nav) ? nav : DEFAULTS.navbar,
    footer: isFooter(footer) ? footer : DEFAULTS.footer,
    hero: isHero(hero) ? hero : DEFAULTS.hero,
    domains: isDomains(domains) ? domains : DEFAULTS.domains,
    insights: isInsights(insights) ? insights : DEFAULTS.insights,
  };
}

let state = load();
const listeners = new Set<() => void>();

export function setLayoutVariant<K extends keyof LayoutVariants>(
  part: K,
  value: LayoutVariants[K],
) {
  state = { ...state, [part]: value };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Variantes affichées (toujours la version 1 si le comparateur est inactif). */
export function useLayoutVariants(): LayoutVariants {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => DEFAULTS,
  );
}
