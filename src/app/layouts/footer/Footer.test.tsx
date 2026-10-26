import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
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

  it('construit les colonnes à partir du menu, sans doublon « Contact »', () => {
    renderFooter();
    const nav = screen.getByRole('navigation', { name: 'Liens du pied de page' });
    const headings = within(nav)
      .getAllByRole('heading')
      .map((h) => h.textContent);
    expect(headings).toEqual([
      'Nos expertises',
      'Formation qualifiante',
      'Missions et réalisations',
      'Éclairages',
      'Actualités',
      'Contact',
      'Découvrir',
    ]);
    expect(within(nav).getByRole('link', { name: 'Catalogue et sessions' })).toHaveAttribute(
      'href',
      '/formation/catalogue-et-sessions',
    );
    expect(within(nav).queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
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
