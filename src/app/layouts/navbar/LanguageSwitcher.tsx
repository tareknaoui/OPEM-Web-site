import { useLanguage } from '@/i18n/useLanguage';
import styles from './Navbar.module.css';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    // Capsule à deux segments ; data-lang place la pastille sous la langue active.
    <div role="group" aria-label={t.languageSwitcher} className={styles.lang} data-lang={lang}>
      <button
        type="button"
        lang="fr"
        className={styles.langButton}
        aria-pressed={lang === 'fr'}
        aria-label="Français"
        onClick={() => setLang('fr')}
      >
        FR
      </button>
      <button
        type="button"
        lang="ar"
        className={styles.langButton}
        aria-pressed={lang === 'ar'}
        aria-label="العربية"
        onClick={() => setLang('ar')}
      >
        عربي
      </button>
    </div>
  );
}
