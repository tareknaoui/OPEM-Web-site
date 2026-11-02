import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { CommitmentsEssential } from './CommitmentsEssential';

const normalize = (text: string | null) => text?.replace(/\s+/g, ' ');

describe('« Ce qui nous distingue »', () => {
  it('présente les trois engagements d’OPEM', () => {
    render(<CommitmentsEssential commitments={homeContent.fr.commitments} />);
    expect(screen.getByText('Pourquoi choisir OPEM')).toBeInTheDocument();
    expect(normalize(screen.getByRole('heading', { level: 2 }).textContent)).toBe(
      'Comprendre avant d’agir, transmettre avant de partir, mesurer avant de conclure.',
    );
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => normalize(heading.textContent)),
    ).toEqual([
      'Du sur-mesure, jamais du prêt-à-porter',
      'Notre réussite : ne plus vous être indispensables',
      'Mesurer, ou ne rien promettre',
    ]);
    expect(screen.getByText(/satisfaction moyenne de 4,6/)).toBeInTheDocument();
  });

  it('passe en arabe avec les mêmes engagements', () => {
    render(<CommitmentsEssential commitments={homeContent.ar.commitments} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByText('نقيس، أو لا نَعِد بشيء')).toBeInTheDocument();
  });
});
