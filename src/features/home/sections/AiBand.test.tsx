import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { AiBand } from './AiBand';

function renderBand(lang: 'fr' | 'ar' = 'fr') {
  const Page = () => <AiBand ai={homeContent[lang].ai} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Intelligence artificielle appliquée »', () => {
  it('présente l’approche et ses trois temps', () => {
    renderBand();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'L’IA entre dans l’entreprise par la porte de l’organisation.',
    );
    expect(screen.getByRole('link', { name: /Découvrir l’approche/ })).toHaveAttribute(
      'href',
      '/expertises/intelligence-artificielle',
    );
    const steps = within(screen.getByRole('list', { name: 'Notre démarche en trois temps' }));
    expect(steps.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '01DiagnosticRepérer où l’IA crée réellement de la valeur',
      '02FormationExploiter l’IA au quotidien, côté métier',
      '03IntégrationDéployer, avec des données sous contrôle',
    ]);
    // Illustration décorative : la porte ouverte sur l'organisation.
    expect(document.querySelector('img')).toHaveAttribute('src', '/images/ia/porte.webp');
    expect(document.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('existe aussi en arabe', () => {
    renderBand('ar');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/الذكاء الاصطناعي/);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
