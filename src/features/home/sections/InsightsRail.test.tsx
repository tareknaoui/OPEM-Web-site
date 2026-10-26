import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { homeContent } from '../content';
import { InsightsRail } from './InsightsRail';

function renderSection() {
  const Page = () => (
    <LanguageProvider>
      <InsightsRail insights={homeContent.fr.insights} />
    </LanguageProvider>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const cardTitles = () =>
  screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

describe('Section « Éclairages et actualités », rail défilant', () => {
  it('aligne toutes les publications, chaque carte étant cliquable', () => {
    renderSection();
    expect(cardTitles()).toHaveLength(6);
    const first = screen.getAllByRole('listitem')[0]!;
    expect(within(first).getByRole('link')).toHaveAttribute('href', '/eclairages/articles-signes');
    expect(within(first).getByText('14 octobre 2026')).toBeInTheDocument();
  });

  it('propose des flèches pour faire défiler le rail', () => {
    renderSection();
    expect(screen.getByRole('button', { name: 'Publications précédentes' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publications suivantes' })).toBeInTheDocument();
  });

  it('filtre les éclairages', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: 'Éclairages' }));
    expect(cardTitles()).toHaveLength(3);
    expect(screen.getByText(/Publications d’exemple/)).toBeInTheDocument();
  });
});
