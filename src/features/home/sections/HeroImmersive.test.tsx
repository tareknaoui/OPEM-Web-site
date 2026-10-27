import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { homeContent } from '../content';
import { HeroImmersive } from './HeroImmersive';

function renderHero() {
  const { hero, heroVideo, heroImmersive, markers } = homeContent.fr;
  const Page = () => (
    <HeroImmersive hero={hero} video={heroVideo} immersive={heroImmersive} markers={markers} />
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Bandeau « Immersif »', () => {
  it('oriente vers les rubriques clés depuis la carte « besoin »', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Faire progresser votre organisation.',
    );
    const choices = within(screen.getByRole('list', { name: 'De quoi avez-vous besoin ?' }));
    expect(choices.getByRole('link', { name: 'Formation qualifiante' })).toHaveAttribute(
      'href',
      '/formation',
    );
    expect(screen.getByRole('link', { name: /Demander un devis/ })).toHaveAttribute(
      'href',
      '/contact',
    );
    expect(screen.getByText('Partout en Algérie')).toBeInTheDocument();
  });

  it('lit la vidéo sur grand écran, avec un bouton pause', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as MediaQueryList);
    const { container } = renderHero();
    expect(container.querySelector('video')).toHaveAttribute('src', '/videos/hero-opem.mp4');
    expect(screen.getByRole('button', { name: 'Mettre la vidéo en pause' })).toBeInTheDocument();
  });
});
