import { useLanguage } from '@/i18n/useLanguage';
import { mentionsContent } from './content';
import { LegalDocument } from './LegalLayout';

/** Page « Mentions légales » (/mentions-legales), liée depuis le pied de page. */
export default function MentionsPage() {
  const { lang } = useLanguage();
  return <LegalDocument content={mentionsContent[lang]} />;
}
