import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Commitments } from './Commitments';

describe('« Ce qui nous distingue »', () => {
  it('présente les trois engagements, leurs preuves et la comparaison', () => {
    render(<Commitments commitments={homeContent.fr.commitments} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Un cabinet qui rend vos équipes autonomes.',
    );
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual([
      'Vos équipes prennent le relais.',
      'Vos données restent confidentielles.',
      'Des spécialistes qui connaissent le terrain.',
    ]);

    const confidentiality = screen.getByText('Vos données restent confidentielles.').closest('li');
    expect(confidentiality).not.toBeNull();
    const card = within(confidentiality as HTMLElement);
    expect(card.getByText('Aucune référence citée sans votre accord')).toBeInTheDocument();
    expect(
      card.getByText(/des informations sensibles qui circulent sans cadre/),
    ).toBeInTheDocument();
  });

  it('signale des engagements encore à confirmer', () => {
    render(<Commitments commitments={homeContent.fr.commitments} />);
    expect(screen.getByText('Engagements proposés, à confirmer par OPEM.')).toBeInTheDocument();
  });
});
