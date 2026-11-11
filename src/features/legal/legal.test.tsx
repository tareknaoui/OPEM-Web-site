import { render, screen, within } from '@testing-library/react';
import type { ComponentType } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { legalLinks } from '@/app/layouts/footer/legalLinks';
import { company } from '@/config/company';
import { isPublished, PUBLISHED_PAGES } from '@/config/pages';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import MentionsPage from './MentionsPage';
import PrivacyPage from './PrivacyPage';
import SitemapPage from './SitemapPage';

vi.mock('@/lib/env', () => ({
  env: { appName: 'OPEM', apiUrl: '/api', wpApiUrl: null, isDev: false },
}));

function renderPage(Page: ComponentType, path: string) {
  const router = createMemoryRouter([{ path: '*', Component: Page }], { initialEntries: [path] });
  render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Pages légales', () => {
  it('chaque lien légal du pied de page mène à une page publiée', () => {
    for (const { href } of legalLinks) {
      expect(PUBLISHED_PAGES).toContain(href);
    }
  });

  it('les mentions légales donnent l’éditeur, la directrice de la publication et l’hébergement', () => {
    renderPage(MentionsPage, '/mentions-legales');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mentions légales');
    for (const title of ['Éditeur du site', 'Directrice de la publication', 'Hébergement']) {
      expect(
        screen.getByRole('heading', { level: 2, name: new RegExp(title) }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText(company.address.fr)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: company.email })).toHaveAttribute(
      'href',
      `mailto:${company.email}`,
    );
    // Les informations qu'OPEM n'a pas encore fournies sont signalées, jamais inventées.
    expect(screen.getAllByText('à compléter').length).toBeGreaterThan(0);
  });

  it('le sommaire renvoie à chaque section', () => {
    renderPage(MentionsPage, '/mentions-legales');
    const toc = screen.getByRole('navigation', { name: 'Sur cette page' });
    for (const link of within(toc).getAllByRole('link')) {
      const id = link.getAttribute('href')?.slice(1) ?? '';
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it('la politique de confidentialité reprend les durées annoncées par les formulaires', () => {
    renderPage(PrivacyPage, '/confidentialite');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Politique de confidentialité',
    );
    expect(screen.getByRole('heading', { name: 'Demande de rendez-vous' })).toBeInTheDocument();
    expect(screen.getByText(/Cinq ans après notre dernier contact/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: company.privacyEmail })[0]).toHaveAttribute(
      'href',
      `mailto:${company.privacyEmail}`,
    );
  });

  it('le plan du site ne propose que des pages qui existent', () => {
    renderPage(SitemapPage, '/plan-du-site');
    const internal = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('/'));
    expect(internal).toContain('/le-cabinet');
    expect(internal).toContain('/mentions-legales');
    for (const href of internal) expect(isPublished(href), href).toBe(true);
    // Rubrique encore sans page : absente du plan.
    expect(internal).not.toContain('/eclairages/articles-signes');
  });
});
