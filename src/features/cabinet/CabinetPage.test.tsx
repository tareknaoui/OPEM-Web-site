import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import CabinetPage from './CabinetPage';

function renderCabinet() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <CabinetPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Le cabinet »', () => {
  it('ouvre sur la photo et le titre, puis « Notre histoire »', () => {
    renderCabinet();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Conseil, études et formation, au service de votre performance.',
    );
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Ce qui nous a fait naître.',
    ]);
  });

  it('bloc 02 : textes mot pour mot et frise des trois repères', () => {
    renderCabinet();
    expect(screen.getByText('Notre histoire', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText(/^À l’origine d’OPEM, une conviction/)).toHaveTextContent(
      /en pleine mutation\.$/,
    );
    expect(
      screen
        .getAllByRole('listitem')
        .filter((item) => item.querySelector('time'))
        .map((item) => item.textContent),
    ).toEqual([
      '2019Création d’OPEMCinq domaines d’expertise',
      '2025Communication institutionnelleSixième domaine',
      '2026Intelligence artificielleAppliquée aux organisations',
    ]);
  });

  it('la barre des rubriques mène aux blocs construits', () => {
    renderCabinet();
    const nav = screen.getByRole('navigation', { name: 'Sur cette page' });
    expect(within(nav).getByRole('link', { name: 'Notre histoire' })).toHaveAttribute(
      'href',
      '#notre-histoire',
    );
  });

  it('passe en arabe', () => {
    renderCabinet();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('في خدمة أدائكم.');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ما الذي أوجدنا.');
  });
});
