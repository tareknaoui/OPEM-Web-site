import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { homeContent } from '../content';
import { upcomingSessions } from './sessionDates';
import { UpcomingSessions } from './UpcomingSessions';

const trainings = homeContent.fr.trainings;

function renderSessions(content = trainings) {
  const Page = () => <UpcomingSessions trainings={content} />;
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
    vi.setSystemTime(new Date(2026, 10, 3, 9)); // 3 novembre 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('montre les cinq sessions de décembre dans l’ordre des dates', () => {
    renderSessions();
    const list = within(screen.getByRole('list', { name: 'Sessions à venir' }));
    expect(list.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)).toEqual([
      'Diagnostic d’organisation',
      'Plan de formation 2027',
      'Cybersécurité opérationnelle',
      'ISO 9001:2026',
      'ChatGPT et Claude en pratique',
    ]);
    expect(list.getByText('Dans 33 jours')).toBeInTheDocument();
    expect(list.getByText('du 6 au 9 décembre')).toBeInTheDocument();
    expect(list.getByText('du dimanche 6 au mercredi 9 décembre 2026')).toBeInTheDocument();
    expect(list.getByText('Repérer les blocages, optimiser les processus')).toBeInTheDocument();
    expect(list.getAllByText('Présentiel · Alger · 3 jours')).toHaveLength(2);
    // Le titre mène à la fiche, « S'inscrire » à sa partie « Inscription ».
    expect(list.getByRole('link', { name: 'Diagnostic d’organisation' })).toHaveAttribute(
      'href',
      '/formation/fiches-formation/diagnostic-d-organisation',
    );
    expect(
      list.getByRole('link', { name: /S’inscrire.*Diagnostic d’organisation/ }),
    ).toHaveAttribute('href', '/formation/fiches-formation/diagnostic-d-organisation#inscription');
    // « Nouveau » sur la seule première édition.
    expect(list.getAllByText('Nouveau')).toHaveLength(1);
    expect(list.getByText('Nouveau').closest('li')).toHaveTextContent(
      'ChatGPT et Claude en pratique',
    );
    expect(screen.getByRole('link', { name: /Tout le calendrier/ })).toHaveAttribute(
      'href',
      '/formation',
    );
  });

  it('montre au plus les cinq sessions les plus proches', () => {
    const items = [
      ...trainings.items,
      { ...trainings.items[0]!, id: 'janvier', date: '2027-01-10', end: '2027-01-12' },
    ];
    renderSessions({ ...trainings, items });
    const list = within(screen.getByRole('list', { name: 'Sessions à venir' }));
    expect(list.getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(list.queryByText('du 10 au 12 janvier')).not.toBeInTheDocument();
  });

  it('masque les sessions passées et les sessions intra-entreprise', () => {
    const items = [
      ...trainings.items,
      { ...trainings.items[0]!, id: 'intra', date: '2026-12-22', end: '2026-12-23', intra: true },
    ];
    const sessions = upcomingSessions(items, new Date(2026, 11, 14));
    expect(sessions.map((session) => session.id)).toEqual([
      'iso-9001-2026',
      'chatgpt-et-claude-en-pratique',
    ]);
    expect(sessions[0]?.daysLeft).toBe(1);
    expect(upcomingSessions(items, new Date(2026, 11, 21))).toEqual([]);
  });

  it('invite à nous contacter quand aucune session n’est programmée', () => {
    vi.setSystemTime(new Date(2027, 0, 1));
    renderSessions();
    expect(
      screen.getByText(/Le prochain calendrier sera publié très prochainement\./),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Contactez-nous pour organiser une session dans vos locaux.',
      }),
    ).toHaveAttribute('href', '/contact');
  });
});
