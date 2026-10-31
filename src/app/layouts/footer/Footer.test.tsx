import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { LanguageSwitcher } from '../navbar/LanguageSwitcher';
import { Footer } from './Footer';

function renderFooter() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <Footer />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Footer', () => {
  it('affiche les coordonnées cliquables', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: '06 61 11 94 23' })).toHaveAttribute(
      'href',
      'tel:+213661119423',
    );
    expect(screen.getByRole('link', { name: 'general@opem-dz.com' })).toHaveAttribute(
      'href',
      'mailto:general@opem-dz.com',
    );
    expect(screen.getByText(/16, rue La Bruyère, Bouzaréah, Alger/)).toBeInTheDocument();
  });

  it('garde deux colonnes au milieu : « Nos expertises » et « Le site »', () => {
    renderFooter();
    const nav = screen.getByRole('navigation', { name: 'Liens du pied de page' });
    const headings = within(nav)
      .getAllByRole('heading')
      .map((h) => h.textContent);
    expect(headings).toEqual(['Nos expertises', 'Le site']);
    expect(within(nav).getByRole('link', { name: 'Coaching professionnel' })).toHaveAttribute(
      'href',
      '/expertises/coaching-professionnel',
    );
    expect(within(nav).getByRole('link', { name: 'Formation qualifiante' })).toHaveAttribute(
      'href',
      '/formation',
    );
    // Ni l'accueil (le logo y mène), ni les sous-pages des autres rubriques.
    expect(within(nav).queryByRole('link', { name: 'Accueil' })).toBeNull();
    expect(within(nav).queryByRole('link', { name: 'Catalogue et sessions' })).toBeNull();
  });

  describe('sur mobile', () => {
    afterEach(() => vi.restoreAllMocks());

    it('replie chaque rubrique en accordéon, une seule ouverte à la fois', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        addEventListener: () => {},
        removeEventListener: () => {},
      } as unknown as MediaQueryList);
      renderFooter();
      const nav = screen.getByRole('navigation', { name: 'Liens du pied de page' });
      const expertises = within(nav).getByRole('button', { name: 'Nos expertises' });
      const site = within(nav).getByRole('button', { name: 'Le site' });
      expect(expertises).toHaveAttribute('aria-expanded', 'false');
      expect(within(nav).queryByRole('link', { name: 'Formation qualifiante' })).toBeNull();

      fireEvent.click(site);
      expect(site).toHaveAttribute('aria-expanded', 'true');
      expect(within(nav).getByRole('link', { name: 'Formation qualifiante' })).toBeVisible();

      fireEvent.click(expertises);
      expect(expertises).toHaveAttribute('aria-expanded', 'true');
      expect(site).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('propose un retour en haut de page sans JavaScript', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Haut de page' })).toHaveAttribute('href', '#top');
  });

  it('passe en arabe', () => {
    renderFooter();
    fireEvent.click(screen.getByRole('button', { name: 'العربية' }));
    expect(screen.getByRole('heading', { name: 'مشروع أو سؤال؟' })).toBeInTheDocument();
    expect(screen.getByText(/بوزريعة/)).toBeInTheDocument();
  });
});
