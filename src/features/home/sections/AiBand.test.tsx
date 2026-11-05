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
      'L’IA entre par la porte de l’organisation.',
    );
    // « IA » mis en évidence dans le titre, « intelligence artificielle » dans le texte.
    expect(screen.getByRole('heading', { level: 2 }).querySelector('strong')).toHaveTextContent(
      /^IA$/,
    );
    expect(
      screen.getByText('intelligence artificielle', { selector: 'p strong' }),
    ).toBeInTheDocument();
    // « Passer la porte » à l'écran ; nom lu par les lecteurs d'écran : l'étiquette invisible.
    const cta = screen.getByRole('link', {
      name: 'Découvrir nos solutions et notre démarche en intelligence artificielle',
    });
    expect(cta).toHaveTextContent('Passer la porte');
    expect(cta).toHaveAttribute('href', '/ia-appliquee');
    const steps = within(screen.getByRole('list', { name: 'Notre démarche en trois temps' }));
    expect(steps.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '01DiagnosticUne carte des usages prioritaires, chiffrée',
      '02FormationDes équipes formées au cœur de leur métier',
      '03AccompagnementUn outil maîtrisé, qui libère temps et ressources',
    ]);
    // Illustration décorative : la porte ouverte sur l'organisation.
    expect(document.querySelector('img')).toHaveAttribute('src', '/images/ia/porte-reseau.webp');
    expect(document.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('existe aussi en arabe', () => {
    renderBand('ar');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/الذكاء الاصطناعي/);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
