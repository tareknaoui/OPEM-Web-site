import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { homeContent } from '@/features/home/content';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import ActualitesPage from './ActualitesPage';

vi.mock('@/lib/env', () => ({
  env: { appName: 'OPEM', apiUrl: '/api', wpApiUrl: 'https://wp.example/wp-json', isDev: false },
}));

function renderPage() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <ActualitesPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }], {
    initialEntries: ['/actualites'],
  });
  render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Actualités »', () => {
  it('reprend les actualités de l’accueil, de la plus récente à la plus ancienne', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('La vie du cabinet.');
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    const expected = [...homeContent.fr.insights.news.items]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((item) => item.title);
    expect(titles).toEqual(expected);
    // Chaque actualité garde son lien et ses thèmes.
    const first = screen.getByRole('listitem', { name: 'Nos formations qualifiantes de décembre' });
    expect(within(first).getByRole('link', { name: /Voir le calendrier/ })).toHaveAttribute(
      'href',
      '/formation/catalogue-et-sessions',
    );
    expect(within(first).getByText('Sécurité informatique')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'La page d’accueil du nouveau site d’OPEM' }),
    ).toBeVisible();
  });

  it('le sommaire mène à chaque carte', () => {
    // jsdom ne fait pas défiler la page : on se contente de vérifier l'arrivée sur la carte.
    Element.prototype.scrollIntoView = vi.fn();
    renderPage();
    const index = screen.getByRole('navigation', { name: 'Sommaire des actualités' });
    const link = within(index).getByRole('link', { name: /OPEM met en ligne son nouveau site/ });
    expect(link).toHaveAttribute('href', '#actualite-nouveau-site');
    fireEvent.click(link);
    expect(document.getElementById('actualite-nouveau-site')).toHaveFocus();
  });

  it('inscription et photos de sessions, légendées', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Recevoir nos actualités' })).toBeInTheDocument();
    const gallery = screen.getByRole('region', { name: 'Au cœur de nos sessions.' });
    expect(gallery.querySelectorAll('figcaption')).toHaveLength(3);
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('حياة المكتب.');
  });
});
