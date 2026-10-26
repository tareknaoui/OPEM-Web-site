import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { LanguageContext } from './context';
import { applyLanguage, readStoredLanguage, storeLanguage, type Lang } from './language';
import { strings } from './strings';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLanguage);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    applyLanguage(next);
    storeLanguage(next);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: strings[lang] }), [lang, setLang]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}
