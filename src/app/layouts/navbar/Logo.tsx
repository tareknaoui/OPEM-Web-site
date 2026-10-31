import { Link } from 'react-router';
import { useLanguage } from '@/i18n/useLanguage';
import styles from './Navbar.module.css';

// Charte : logo blanc à aile verte sur bleu nuit.
export function Logo({ onClick }: { onClick?: () => void }) {
  const { t } = useLanguage();
  return (
    <Link to="/" className={styles.logoLink} onClick={onClick}>
      {/* width/height = proportions réelles : la place est réservée avant le chargement. */}
      <img src="/logo-opem.svg" alt={t.homeLink} width={199} height={75} className={styles.logo} />
    </Link>
  );
}
