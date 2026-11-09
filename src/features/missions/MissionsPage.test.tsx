import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import MissionsPage from './MissionsPage';

function renderPage(path = '/missions') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <MissionsPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }], {
    initialEntries: [path],
  });
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

const cards = () => screen.queryAllByRole('heading', { level: 2 });

describe('Page « Missions et réalisations »', () => {
  it('un titre principal, puis six études de cas et « Afficher plus »', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Études de cas');
    expect(cards()).toHaveLength(6);
    expect(screen.getByText('8 études de cas')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Afficher plus' }));
    expect(cards()).toHaveLength(8);
    expect(screen.queryByRole('button', { name: 'Afficher plus' })).not.toBeInTheDocument();
  });

  it('filtre par domaine et par type de client, puis réinitialise', () => {
    renderPage();
    fireEvent.change(screen.getByRole('combobox', { name: 'Domaine' }), {
      target: { value: 'etudes-strategiques' },
    });
    expect(cards().map((h) => h.textContent)).toEqual([
      'Repérer tôt les entreprises en difficulté',
      'Les dispositifs de formation à l’entrepreneuriat, au crible',
    ]);
    fireEvent.change(screen.getByRole('combobox', { name: 'Type de client' }), {
      target: { value: 'prive' },
    });
    expect(cards()).toHaveLength(0);
    expect(screen.getByText('0 étude de cas')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    expect(cards()).toHaveLength(6);
  });

  it('chaque carte a sa photo, décrite', () => {
    renderPage();
    const list = screen.getByRole('list');
    within(list)
      .getAllByRole('img')
      .forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('دراسات الحالة');
  });
});
