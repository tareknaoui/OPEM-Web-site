import { Outlet, useNavigation } from 'react-router';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { Footer } from './footer/Footer';
import { Navbar } from './navbar/Navbar';
import styles from './RootLayout.module.css';
import { useLayoutVariants, variantsEnabled } from './variants/layoutVariants';
import { VariantSwitcher } from './variants/VariantSwitcher';

export function RootLayout() {
  const { t } = useLanguage();
  const isLoading = useNavigation().state === 'loading';
  useSmoothScroll();
  useScrollReveal();
  // Maquettes en comparaison (version 1 par défaut ; voir ./variants).
  const variants = useLayoutVariants();

  return (
    // id="top" : cible du lien « Haut de page » du pied de page.
    <div id="top" className={styles.shell} data-navbar={variants.navbar}>
      {/* Premier élément atteint avec Tab : saute directement le menu (WCAG 2.4.1). */}
      <a href="#main-content" className={styles.skipLink}>
        {t.skipToContent}
      </a>

      <Navbar variant={variants.navbar} />

      {/* Pleine largeur : chaque page gère ses conteneurs (sections en bandes sur l'accueil). */}
      <main id="main-content" tabIndex={-1} className={styles.main} aria-busy={isLoading}>
        <Outlet />
      </main>

      <Footer variant={variants.footer} />

      {variantsEnabled && <VariantSwitcher />}
    </div>
  );
}
