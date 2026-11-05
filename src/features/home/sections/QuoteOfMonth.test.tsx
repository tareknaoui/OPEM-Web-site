import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { QuoteOfMonth } from './QuoteOfMonth';

const quote = homeContent.fr.quoteOfMonth;

describe('« La citation du mois »', () => {
  it('affiche l’étiquette, la citation, l’auteur, l’ouvrage et le commentaire', () => {
    render(<QuoteOfMonth quote={quote} />);
    expect(screen.getByRole('region', { name: 'La citation du mois' })).toBeInTheDocument();
    expect(screen.getByRole('blockquote')).toHaveTextContent(
      'L’obstacle à l’action fait avancer l’action. Ce qui barre la route fait faire du chemin.',
    );
    expect(document.querySelector('figcaption')).toHaveTextContent('Marc AurèlePensées');
    expect(document.querySelector('figcaption cite')).toHaveTextContent('Pensées');
    expect(screen.getByText(/^Toute difficulté porte en elle sa leçon\./)).toBeInTheDocument();
  });

  it('n’affiche ni ouvrage ni commentaire quand ils manquent', () => {
    render(<QuoteOfMonth quote={{ ...quote, source: undefined, comment: undefined }} />);
    expect(document.querySelector('cite')).toBeNull();
    expect(screen.queryByText(/Toute difficulté/)).toBeNull();
  });

  it('dessine le rocher contourné, décoratif, avec le marcheur au fanion par défaut', () => {
    render(<QuoteOfMonth quote={quote} />);
    const art = document.querySelector('[aria-hidden="true"] svg');
    expect(art).not.toBeNull();
    expect(art?.querySelector('g[transform^="translate("]')).not.toBeNull();
  });
});
