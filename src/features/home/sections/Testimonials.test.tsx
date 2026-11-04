import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Testimonials } from './Testimonials';

const { testimonials } = homeContent.fr;

/** Texte lu de l'étape, sans les flèches (masquées aux lecteurs d'écran). */
const normalize = (element: HTMLElement) =>
  [...element.children]
    .filter((child) => child.getAttribute('aria-hidden') !== 'true')
    .map((child) => child.textContent)
    .join(' ');

function renderSection() {
  const Page = () => <Testimonials testimonials={testimonials} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Section « Témoignages »', () => {
  it('raconte l’étude de cas en trois temps, dans l’ordre', () => {
    renderSection();
    expect(screen.getByRole('heading', { level: 3, name: /audit approuvé/ })).toBeInTheDocument();
    // L'histoire en une phrase, puis les trois temps, tous visibles, dans l'ordre ; le temps
    // écoulé depuis l'étape précédente est lu avec l'année.
    expect(screen.getByText(/Deux ans plus tard, elle nous confie tout son plan/)).toBeVisible();
    const steps = within(screen.getAllByRole('list')[0]!).getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    [
      /^2021 L’audit Organisation/,
      /La même année, 2021 Le verdict À l’unanimité/,
      /Deux ans plus tard, 2023 La confiance 100\s%/,
    ].forEach((text, index) => expect(normalize(steps[index]!)).toMatch(text));
    expect(screen.getByText(/^Une entreprise publique économique nous confie/)).toBeVisible();
    expect(screen.queryByText(/établissement public/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Lire l’étude de cas/ })).toHaveAttribute(
      'href',
      '/missions/etudes-de-cas/audit-organisationnel-et-plan-de-formation',
    );
  });

  it('affiche les 3 recommandations, signées d’une direction, puis un seul lien', () => {
    renderSection();
    expect(screen.getAllByRole('blockquote')).toHaveLength(3);
    expect(
      [...document.querySelectorAll('figcaption')].map((caption) => caption.textContent),
    ).toEqual([
      'Direction générale d’une entreprise publique, 2020',
      'Direction d’une entreprise industrielle, 2025',
      'Direction générale d’un office public national, 2024',
    ]);
    expect(screen.queryByRole('link', { name: /Lire le témoignage/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Lire d’autres témoignages/ })).toHaveAttribute(
      'href',
      '/missions/references-clients',
    );
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
