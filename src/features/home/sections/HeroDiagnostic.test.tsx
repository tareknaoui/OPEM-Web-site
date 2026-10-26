import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { HeroDiagnostic } from './HeroDiagnostic';

function renderHero() {
  const Page = () => (
    <HeroDiagnostic diagnostic={homeContent.fr.heroDiagnostic} video={homeContent.fr.heroVideo} />
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Autodiagnostic »', () => {
  it('pose la première question avec cinq réponses : suite du diagnostic ou catalogue', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Nous rendons votre organisation plus performante.',
    );
    const answers = within(
      screen.getByRole('list', { name: /Quelle est votre priorité cette année/ }),
    );
    const links = answers.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'Former mes équipes',
      'Obtenir une certification',
      'Répondre à un marché public',
      'Mieux organiser mon service',
      'Nos formations',
    ]);
    expect(links[4]).toHaveAttribute('href', '/formation');
    expect(links[2]).toHaveAttribute('href', '/autodiagnostic?priorite=marche-public');
  });
});
