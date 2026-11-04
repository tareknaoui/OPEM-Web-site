import { useLanguage } from '@/i18n/useLanguage';
import styles from './Navbar.module.css';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    // Capsule à deux segments ; data-lang place la pastille sous la langue active. Le nom lu
    // contient le texte visible (WCAG 2.5.3) : « FR, Français » ; « عربي » se suffit.
    <div role="group" aria-label={t.languageSwitcher} className={styles.lang} data-lang={lang}>
      <button
        type="button"
        lang="fr"
        className={styles.langButton}
        aria-pressed={lang === 'fr'}
        aria-label="FR, Français"
        onClick={() => setLang('fr')}
      >
        FR
      </button>
      <button
        type="button"
        lang="ar"
        className={styles.langButton}
        aria-pressed={lang === 'ar'}
        onClick={() => setLang('ar')}
      >
        عربي
      </button>
    </div>
  );
}
