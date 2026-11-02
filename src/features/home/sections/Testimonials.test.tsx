import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Testimonials } from './Testimonials';

const { testimonials } = homeContent.fr;

function renderSection() {
  const Page = () => <Testimonials testimonials={testimonials} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Section « Témoignages »', () => {
  it('raconte l’étude de cas en trois temps, dans l’ordre', () => {
    renderSection();
    expect(screen.getByRole('heading', { level: 3, name: /audit approuvé/ })).toBeInTheDocument();
    const steps = within(screen.getAllByRole('list')[0]!).getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    ['L’audit', 'Le verdict', 'La confiance'].forEach((label, index) =>
      expect(steps[index]).toHaveTextContent(label),
    );
    expect(screen.getByRole('link', { name: /Lire l’étude de cas/ })).toHaveAttribute(
      'href',
      '/missions',
    );
  });

  it('affiche les 3 recommandations, sans nom de personne, chacune avec son lien', () => {
    renderSection();
    expect(screen.getAllByRole('blockquote')).toHaveLength(3);
    expect(screen.getByText(/Directeur général d’une entreprise publique, 2020/)).toBeVisible();
    expect(screen.getAllByRole('link', { name: /Lire le témoignage/ })).toHaveLength(3);
  });

  it('présente les institutions qui confient leurs études', () => {
    renderSection();
    expect(
      screen.getByRole('heading', { level: 3, name: testimonials.studies.title }),
    ).toBeInTheDocument();
    testimonials.studies.ministries.items.forEach((item) =>
      expect(screen.getByText(item)).toBeInTheDocument(),
    );
    expect(screen.getByRole('link', { name: /Découvrir nos études/ })).toHaveAttribute(
      'href',
      '/expertises/etudes-strategiques',
    );
  });
});
