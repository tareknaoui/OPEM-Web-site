import { use } from 'react';
import { LanguageContext } from './context';

export function useLanguage() {
  const value = use(LanguageContext);
  if (!value) throw new Error('useLanguage doit être utilisé dans <LanguageProvider>');
  return value;
}
