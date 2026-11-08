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
        path: 'le-cabinet',
        lazy: async () => ({
          Component: (await import('@/features/cabinet/CabinetPage')).default,
        }),
      },
      {
        path: 'nos-expertises',
        lazy: async () => ({
          Component: (await import('@/features/expertises/ExpertisesPage')).default,
        }),
      },
      {
        path: 'expertises/etudes-strategiques',
        lazy: async () => ({
          Component: (await import('@/features/etudes/EtudesPage')).default,
        }),
      },
      {
        path: 'ia-appliquee',
        lazy: async () => ({ Component: (await import('@/features/ia/IaPage')).default }),
      },
      {
        path: 'eclairages',
        lazy: async () => ({
          Component: (await import('@/features/eclairages/EclairagesPage')).default,
        }),
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
        path: 'contact/demande-de-rendez-vous',
        lazy: async () => ({
          Component: (await import('@/features/forms/AppointmentPage')).default,
        }),
      },
      {
        path: 'contact/rejoindre-notre-reseau',
        lazy: async () => ({
          Component: (await import('@/features/forms/JoinPage')).default,
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
