import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { CommitmentsEssential } from './CommitmentsEssential';

describe('« Ce qui nous distingue », version « L’essentiel »', () => {
  it('résume chaque engagement en quelques mots et une phrase', () => {
    render(<CommitmentsEssential commitments={homeContent.fr.commitments} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /^Notre réussite\s: des équipes qui gagnent en autonomie\.$/,
    );
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual([
      'Vos équipes prennent le relais',
      'Vos données protégées',
      'Des spécialistes du terrain',
    ]);
    expect(screen.getByText('Rien n’est partagé sans votre accord écrit.')).toBeInTheDocument();
    // Pas de preuves détaillées ni de comparaison dans cette version.
    expect(screen.queryByText(/Ailleurs, souvent/)).toBeNull();
  });

  it('passe en arabe avec les mêmes engagements', () => {
    render(<CommitmentsEssential commitments={homeContent.ar.commitments} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByText('متخصصون في الميدان')).toBeInTheDocument();
  });
});
