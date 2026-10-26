export const languages = ['fr', 'ar'] as const;
export type Lang = (typeof languages)[number];

const STORAGE_KEY = 'lang';

function isLang(value: unknown): value is Lang {
  return languages.includes(value as Lang);
}

// localStorage peut être indisponible (navigation privée, cookies bloqués).
export function readStoredLanguage(): Lang {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : 'fr';
  } catch {
    return 'fr';
  }
}

export function storeLanguage(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Stockage indisponible : la langue s'applique quand même pour cette visite.
  }
}

/** Met à jour <html lang dir> : l'arabe passe toute la page en miroir (droite à gauche). */
export function applyLanguage(lang: Lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
