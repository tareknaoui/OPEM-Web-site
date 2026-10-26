import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { HeroEditorial } from './HeroEditorial';

function renderHero(tone?: 'light' | 'dark') {
  const { hero, heroVideo, heroEditorial } = homeContent.fr;
  const Page = () => (
    <HeroEditorial hero={hero} video={heroVideo} editorial={heroEditorial} tone={tone} />
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Éditorial »', () => {
  it('affiche le titre, la légende de l’image et les trois métiers', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Bâtir des organisations qui performent.',
    );
    expect(screen.getByText(/Chaque organisation a sa méthode/)).toBeInTheDocument();

    const pillars = within(screen.getByRole('navigation', { name: 'Nos trois métiers' }));
    expect(pillars.getAllByRole('link')).toHaveLength(3);
    expect(pillars.getByRole('link', { name: /Formation/ })).toHaveAttribute('href', '/formation');
  });

  it('en ton bleu nuit, passe le bouton principal en blanc', () => {
    renderHero('dark');
    expect(screen.getByRole('link', { name: /Demander un devis/ })).toHaveClass('btn-light');
  });
});
