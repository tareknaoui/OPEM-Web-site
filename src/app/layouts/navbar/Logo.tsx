import { Link } from 'react-router';
import { useLanguage } from '@/i18n/useLanguage';
import styles from './Navbar.module.css';

export type LogoTone = 'white' | 'color';

// Charte : logo blanc à aile verte sur bleu nuit, logo couleur sur fond clair.
const LOGOS: Record<LogoTone, string> = {
  white: '/logo-opem.svg',
  color: '/logo-opem-couleur.svg',
};

export function Logo({ onClick, tone = 'white' }: { onClick?: () => void; tone?: LogoTone }) {
  const { t } = useLanguage();
  return (
    <Link to="/" className={styles.logoLink} onClick={onClick}>
      {/* width/height = proportions réelles : la place est réservée avant le chargement. */}
      <img src={LOGOS[tone]} alt={t.homeLink} width={199} height={75} className={styles.logo} />
    </Link>
  );
}
