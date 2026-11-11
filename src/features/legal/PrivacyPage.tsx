import { useLanguage } from '@/i18n/useLanguage';
import { privacyContent } from './content';
import { LegalDocument } from './LegalLayout';

/** Page « Politique de confidentialité » (/confidentialite), liée depuis le pied de page. */
export default function PrivacyPage() {
  const { lang } = useLanguage();
  return <LegalDocument content={privacyContent[lang]} />;
}
