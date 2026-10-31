import { lazy, Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { Footer } from './footer/Footer';
import { Navbar } from './navbar/Navbar';
import styles from './RootLayout.module.css';

// Éditeur en direct (textes, tailles, emplacements) : développement seulement, absent du build.
const LiveEditor = import.meta.env.DEV ? lazy(() => import('./liveEdit/LiveEditor')) : null;

export function RootLayout() {
  const { t } = useLanguage();
  const isLoading = useNavigation().state === 'loading';
  useSmoothScroll();
  useScrollReveal();

  return (
    // id="top" : cible du lien « Haut de page » du pied de page.
    <div id="top" className={styles.shell}>
      {/* Premier élément atteint avec Tab : saute directement le menu (WCAG 2.4.1). */}
      <a href="#main-content" className={styles.skipLink}>
        {t.skipToContent}
      </a>

      <Navbar />

      {/* Pleine largeur : chaque page gère ses conteneurs (sections en bandes sur l'accueil). */}
      <main id="main-content" tabIndex={-1} className={styles.main} aria-busy={isLoading}>
        <Outlet />
      </main>

      <Footer />

      {LiveEditor && (
        <Suspense fallback={null}>
          <LiveEditor />
        </Suspense>
      )}
    </div>
  );
}
