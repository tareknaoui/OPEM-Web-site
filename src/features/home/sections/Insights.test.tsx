import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { homeContent } from '../content';
import { Insights } from './Insights';

function renderSection() {
  const Page = () => (
    <LanguageProvider>
      <Insights insights={homeContent.fr.insights} />
    </LanguageProvider>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const cardTitles = () =>
  screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

describe('Section « Éclairages et actualités »', () => {
  it('met une publication à la une et rend chaque carte cliquable', () => {
    renderSection();
    expect(cardTitles()).toHaveLength(6);
    expect(cardTitles()[0]).toBe('Certification ISO : ce que l’audit vérifie vraiment');
    const first = screen.getAllByRole('listitem')[0]!;
    expect(within(first).getByRole('link')).toHaveAttribute('href', '/eclairages/articles-signes');
    expect(within(first).getByText('14 octobre 2026')).toBeInTheDocument();
  });

  it('filtre les éclairages et les actualités', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: 'Actualités' }));
    expect(screen.getByRole('button', { name: 'Actualités' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(cardTitles()).toHaveLength(3);
    expect(cardTitles()[0]).toMatch(/ISO 9001/);
  });

  it('signale que les publications sont des exemples', () => {
    renderSection();
    expect(screen.getByText(/Publications d’exemple/)).toBeInTheDocument();
  });
});
