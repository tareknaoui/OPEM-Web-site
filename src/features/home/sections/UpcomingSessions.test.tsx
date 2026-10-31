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

  it('affiche les sessions à venir, avec le compte à rebours et l’inscription', () => {
    renderSessions();
    const list = within(screen.getByRole('list', { name: 'Sessions à venir' }));
    const titles = list.getAllByRole('heading', { level: 3 }).map((title) => title.textContent);
    expect(titles[0]).toBe('Management de la qualité selon l’ISO 9001');
    expect(list.getByText('Demain')).toBeInTheDocument();
    expect(list.getByText('Dans 9 jours')).toBeInTheDocument();
    expect(
      list.getByRole('link', { name: /S’inscrire.*Management de la qualité/ }),
    ).toHaveAttribute('href', '/contact?formation=iso-9001');
    expect(screen.getByRole('link', { name: /Tout le calendrier/ })).toHaveAttribute(
      'href',
      '/formation',
    );
  });

  it('masque les sessions passées', () => {
    const sessions = upcomingSessions(homeContent.fr.trainings.items, new Date(2026, 11, 8));
    expect(sessions.map((session) => session.id)).toEqual(['projets-btph']);
    expect(sessions[0]?.daysLeft).toBe(6);
  });

  it('annonce de prochaines sessions quand le calendrier est vide', () => {
    vi.setSystemTime(new Date(2027, 0, 1));
    renderSessions();
    expect(
      screen.getByText('Les prochaines sessions seront annoncées très bientôt.'),
    ).toBeInTheDocument();
  });
});
