import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { DomainsCarousel } from './DomainsCarousel';

function renderSection() {
  const Page = () => <DomainsCarousel domains={homeContent.fr.domains} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const triggers = () => screen.getAllByRole('button', { expanded: false, hidden: false });
const openTrigger = () => screen.getByRole('button', { expanded: true });

describe('« Nos domaines », carrousel à panneaux', () => {
  it('montre les six domaines et en ouvre un seul', () => {
    renderSection();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    expect(openTrigger()).toHaveTextContent('Études stratégiques');
    expect(triggers()).toHaveLength(5);
    expect(screen.getByText('1 sur 6')).toBeInTheDocument();
  });

  it('change de domaine au clic, aux flèches du clavier et avec suivant / précédent', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: /Coaching professionnel/ }));
    expect(openTrigger()).toHaveTextContent('Coaching professionnel');

    fireEvent.keyDown(openTrigger(), { key: 'ArrowRight' });
    expect(openTrigger()).toHaveTextContent('Communication d’entreprise');
    expect(openTrigger()).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Domaine suivant' }));
    expect(openTrigger()).toHaveTextContent('Certification');
    // Après le dernier domaine, on revient au premier.
    fireEvent.click(screen.getByRole('button', { name: 'Domaine suivant' }));
    expect(openTrigger()).toHaveTextContent('Études stratégiques');

    fireEvent.click(screen.getByRole('button', { name: 'Domaine précédent' }));
    expect(openTrigger()).toHaveTextContent('Certification');
    expect(screen.getByText('6 sur 6')).toBeInTheDocument();
  });
});
