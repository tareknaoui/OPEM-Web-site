import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { homeContent } from '../content';
import { HeroVideo } from './HeroVideo';

function renderHero() {
  const { hero, heroVideo, markers } = homeContent.fr;
  const Page = () => <HeroVideo hero={hero} video={heroVideo} markers={markers} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const mockMatchMedia = (matches: boolean) =>
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Bandeau « Vidéo »', () => {
  it('affiche le titre et la vidéo avec un bouton pause sur grand écran', () => {
    mockMatchMedia(true);
    const { container } = renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Faire progresser votre organisation.',
    );
    const video = container.querySelector('video')!;
    expect(video).toHaveAttribute('src', '/videos/hero-ruche.mp4');
    expect(video.muted).toBe(true);
    expect(screen.getByRole('button', { name: 'Mettre la vidéo en pause' })).toBeInTheDocument();
  });

  it('montre seulement l’image fixe sur mobile ou en mouvement réduit', () => {
    mockMatchMedia(false);
    const { container } = renderHero();
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('img[src="/videos/hero-ruche.jpg"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /vidéo/ })).not.toBeInTheDocument();
  });
});
