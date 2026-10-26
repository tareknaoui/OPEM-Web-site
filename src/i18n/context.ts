import { createContext } from 'react';
import type { Lang } from './language';
import type { Strings } from './strings';

export type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);
