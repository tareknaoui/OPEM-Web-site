import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import FormationPage from './FormationPage';

function renderPage(path = '/formation') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <FormationPage />
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

describe('Page « Formation qualifiante »', () => {
  // Les sessions de l'accueil ont lieu en décembre 2026 : on se place avant.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-09T10:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('un titre principal, puis l’agenda, les deux formats et le témoignage', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Une compétence se construit, puis s’éprouve au travail.',
    );
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Les prochaines sessions',
      'Dans vos locaux ou avec d’autres organisations.',
      'Une formation se juge à ce qu’elle change.',
    ]);
    expect(screen.getByText(/décision n°\s539 du 24\sdécembre 2019/)).toBeInTheDocument();
  });

  it('l’agenda : les sessions à venir, dans l’ordre, chacune avec « S’inscrire »', () => {
    renderPage('/formation/catalogue-et-sessions');
    const agenda = screen.getByRole('region', { name: 'Les prochaines sessions' });
    const titles = within(agenda)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles[0]).toBe('Diagnostic d’organisation');
    expect(titles).toHaveLength(5);
    expect(within(agenda).getAllByRole('link', { name: /^S’inscrire/ })).toHaveLength(5);
    expect(within(agenda).getByText('Nouveau')).toBeInTheDocument();
  });

  it('masque les sessions passées', () => {
    vi.setSystemTime(new Date('2026-12-16T10:00:00'));
    renderPage();
    const agenda = screen.getByRole('region', { name: 'Les prochaines sessions' });
    expect(
      within(agenda)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(['Cybersécurité opérationnelle', 'ISO 9001:2026', 'ChatGPT et Claude en pratique']);
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'الكفاءة تُبنى، ثم تُختبر في العمل.',
    );
  });
});
