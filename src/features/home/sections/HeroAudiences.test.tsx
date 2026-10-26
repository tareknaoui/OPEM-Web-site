import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { HeroAudiences } from './HeroAudiences';

function renderHero() {
  const { heroAudiences, heroVideo } = homeContent.fr;
  const Page = () => <HeroAudiences audiences={heroAudiences} video={heroVideo} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Public / entreprise »', () => {
  it('propose un bloc par type de client, chacun avec son lien', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Nous rendons votre organisation plus performante.',
    );
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Vous êtes un organisme public',
      'Vous êtes une entreprise',
    ]);
    expect(screen.getByRole('link', { name: /Voir nos références/ })).toHaveAttribute(
      'href',
      '/missions/references-clients',
    );
    expect(screen.getByRole('link', { name: /Découvrir nos expertises/ })).toHaveAttribute(
      'href',
      '/expertises',
    );
  });
});
