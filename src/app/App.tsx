import { RouterProvider } from 'react-router/dom';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { router } from './router';

// Point d'entrée de l'application : c'est ici qu'on ajoute les providers
// globaux (langue, authentification, cache de données…) autour du routeur.
export function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
