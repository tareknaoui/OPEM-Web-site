import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { RouteError } from './RouteError';

// Chaque page est chargée à la demande (`lazy`) : le navigateur ne télécharge
// que le code de la page visitée, ce qui accélère le premier affichage.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteError,
    // Affiché pendant le tout premier chargement de la page demandée (quelques ms).
    HydrateFallback: () => null,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/features/home/HomePage')).default }),
      },
      {
        path: 'about',
        lazy: async () => ({ Component: (await import('@/features/about/AboutPage')).default }),
      },
      {
        path: 'contact',
        lazy: async () => ({
          Component: (await import('@/features/contact/ContactPage')).default,
        }),
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('@/features/not-found/NotFoundPage')).default,
        }),
      },
    ],
  },
]);
