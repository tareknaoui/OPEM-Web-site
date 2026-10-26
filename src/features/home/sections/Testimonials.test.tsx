import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Testimonials } from './Testimonials';

function renderSection() {
  const Page = () => <Testimonials testimonials={homeContent.fr.testimonials} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Section « Témoignages »', () => {
  it('affiche le premier témoignage et la liste des quatre', () => {
    renderSection();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Formations');
    expect(screen.getByRole('blockquote')).toHaveTextContent(/Les formations partaient/);
  });

  it('change de témoignage au clic, aux flèches et au clavier', () => {
    renderSection();
    fireEvent.click(screen.getByRole('tab', { name: /Certification/ }));
    expect(screen.getByRole('blockquote')).toHaveTextContent(/préparés à l’audit/);
    fireEvent.click(screen.getByRole('button', { name: 'Témoignage suivant' }));
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Accompagnement');
    expect(screen.getByText('Témoignage 3 sur 4')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('tab', { selected: true }), { key: 'End' });
    expect(screen.getByRole('tab', { name: /Études stratégiques/ })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('tab', { selected: true }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Formations');
  });

  it('signale que les témoignages sont des exemples', () => {
    renderSection();
    expect(screen.getByText(/Témoignages d’exemple/)).toBeInTheDocument();
  });
});
