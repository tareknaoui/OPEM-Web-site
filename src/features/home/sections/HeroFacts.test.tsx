import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { HeroFacts } from './HeroFacts';

function renderHero() {
  const { hero, heroVideo, heroFacts } = homeContent.fr;
  const Page = () => <HeroFacts hero={hero} video={heroVideo} facts={heroFacts} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Repères »', () => {
  it('affiche les boutons puis trois faits, signalés comme provisoires', () => {
    renderHero();
    expect(screen.getByRole('link', { name: /Demander un devis/ })).toBeInTheDocument();
    // Le conseil et la formation, à égalité.
    expect(screen.getByRole('link', { name: /Nos expertises/ })).toHaveAttribute(
      'href',
      '/expertises',
    );
    expect(screen.getByRole('link', { name: /Nos formations/ })).toHaveAttribute(
      'href',
      '/formation',
    );
    const facts = within(screen.getByRole('list', { name: 'OPEM en bref' })).getAllByRole(
      'listitem',
    );
    expect(facts).toHaveLength(3);
    // Chiffres d'exemple : la mention « à confirmer » doit rester visible tant qu'ils le sont.
    expect(screen.getByText('Chiffres provisoires, à confirmer par OPEM.')).toBeInTheDocument();
  });
});
