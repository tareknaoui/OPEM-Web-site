import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import HomePage from './HomePage';

function renderHome() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <HomePage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('HomePage', () => {
  // Bandeau retenu par défaut : « Repères » (voir layouts/variants).
  it('affiche le grand titre, le bouton devis, les liens et les repères du bandeau', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Faire progresser votre organisation.',
    );
    expect(screen.getByRole('link', { name: /Demander un devis/ })).toHaveAttribute(
      'href',
      '/contact',
    );
    expect(screen.getByRole('link', { name: /Nos expertises/ })).toHaveAttribute(
      'href',
      '/expertises',
    );
    expect(screen.getByText('15 ans')).toBeInTheDocument();
  });

  it('présente les sections dans l’ordre du cahier des charges', () => {
    renderHome();
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Nos domaines',
      'Des idées pour décider, des nouvelles du cabinet.',
      'Ce que retiennent ceux que nous accompagnons.',
      'Tout ce qu’il faut savoir avant de commencer.',
    ]);
  });

  it('passe entièrement en arabe', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: 'العربية' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/نرتقي بأداء مؤسستكم/);
    expect(screen.getByRole('heading', { name: 'ما يحتفظ به من نرافقهم.' })).toBeInTheDocument();
  });
});
