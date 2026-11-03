import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { homeContent } from '../content';
import { upcomingSessions } from './sessionDates';
import { UpcomingSessions } from './UpcomingSessions';

function renderSessions() {
  const Page = () => <UpcomingSessions trainings={homeContent.fr.trainings} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('« Les prochaines sessions »', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 15, 9)); // 15 novembre 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('met en avant la seule session à venir, avec le compte à rebours et l’inscription', () => {
    renderSessions();
    const list = within(screen.getByRole('list', { name: 'Sessions à venir' }));
    expect(list.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)).toEqual([
      'Management de projet',
    ]);
    expect(list.getByText('mardi 1er décembre 2026')).toBeInTheDocument();
    expect(list.getByText('Dans 16 jours')).toBeInTheDocument();
    // Catégorie « MANAGEMENT » : écrite « Management », mise en capitales par le style.
    expect(list.getByText('Management')).toBeInTheDocument();
    expect(
      list.getByText(
        'Cycle de 20 jours en 6 modules, de décembre 2026 au premier trimestre 2027 · Présentiel · [lieu à confirmer par OPEM]',
      ),
    ).toBeInTheDocument();
    expect(list.getByRole('link', { name: /S’inscrire.*Management de projet/ })).toHaveAttribute(
      'href',
      '/contact?formation=management-de-projet',
    );
    expect(screen.getByRole('link', { name: /Tout le calendrier/ })).toHaveAttribute(
      'href',
      '/formation',
    );
  });

  it('masque les sessions passées et les sessions intra-entreprise', () => {
    const items = [
      ...homeContent.fr.trainings.items,
      { ...homeContent.fr.trainings.items[0]!, id: 'intra', date: '2026-12-10', intra: true },
    ];
    const sessions = upcomingSessions(items, new Date(2026, 10, 30));
    expect(sessions.map((session) => session.id)).toEqual(['management-de-projet']);
    expect(sessions[0]?.daysLeft).toBe(1);
    expect(upcomingSessions(items, new Date(2026, 11, 2))).toEqual([]);
  });

  it('annonce de prochaines sessions quand le calendrier est vide', () => {
    vi.setSystemTime(new Date(2027, 0, 1));
    renderSessions();
    expect(
      screen.getByText('Les prochaines sessions seront annoncées très bientôt.'),
    ).toBeInTheDocument();
  });
});
