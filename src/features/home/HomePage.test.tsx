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
  it('affiche le grand titre et l’invitation au diagnostic 7S', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Ce qui fait exceller votre organisation.',
    );
    expect(screen.getByRole('button', { name: /Faire le test/ })).toBeInTheDocument();
  });

  it('présente les sections dans l’ordre du cahier des charges', () => {
    renderHome();
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Sept leviers font votre performance. Un seul suffit à la freiner.',
      'Notre réussite : des équipes qui gagnent en autonomie.',
      'Nos domaines',
      'L’IA entre dans l’entreprise par la porte de l’organisation.',
      'Les prochaines sessions',
      'Des idées pour décider, des nouvelles du cabinet.',
      'Ce que retiennent ceux que nous accompagnons.',
      'Tout ce qu’il faut savoir avant de commencer.',
    ]);
  });

  it('passe entièrement en arabe', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: 'العربية' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ما يجعل مؤسستكم تتميّز/);
    expect(screen.getByRole('heading', { name: 'ما يحتفظ به من نرافقهم.' })).toBeInTheDocument();
  });
});
