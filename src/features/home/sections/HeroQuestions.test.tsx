import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { HeroQuestions } from './HeroQuestions';

function renderHero() {
  const { heroQuestions, heroVideo } = homeContent.fr;
  const Page = () => <HeroQuestions questions={heroQuestions} video={heroVideo} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Trois questions »', () => {
  it('fait des trois questions le titre, chacune liée à son domaine', () => {
    renderHero();
    const title = within(screen.getByRole('heading', { level: 1 }));
    const links = title.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/expertises/certification-et-accreditation',
      '/formation',
      '/expertises/etudes-strategiques',
    ]);
    expect(title.getByRole('link', { name: /Des équipes à former/ })).toBeInTheDocument();
  });

  it('propose d’être rappelé', () => {
    renderHero();
    expect(screen.getByText(/du diagnostic au résultat/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Être rappelé/ })).toHaveAttribute('href', '/contact');
  });
});
