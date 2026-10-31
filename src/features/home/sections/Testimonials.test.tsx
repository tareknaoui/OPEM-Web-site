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
  it('affiche les six témoignages dans l’ordre des domaines, le premier ouvert', () => {
    renderSection();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);
    [
      'Études stratégiques',
      'Accompagnement',
      'Formations',
      'Coaching',
      'Communication',
      'Certification',
    ].forEach((domain, index) => expect(tabs[index]).toHaveTextContent(domain));
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Études stratégiques');
    expect(screen.getByRole('blockquote')).toHaveTextContent(/Le diagnostic a mis des mots/);
  });

  it('change de témoignage au clic, aux flèches et au clavier', () => {
    renderSection();
    fireEvent.click(screen.getByRole('tab', { name: /Formations/ }));
    expect(screen.getByRole('blockquote')).toHaveTextContent(/Les formations partaient/);
    fireEvent.click(screen.getByRole('button', { name: 'Témoignage suivant' }));
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Coaching');
    expect(screen.getByText('Témoignage 4 sur 6')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('tab', { selected: true }), { key: 'End' });
    expect(screen.getByRole('tab', { name: /Certification/ })).toHaveFocus();
    expect(screen.getByRole('blockquote')).toHaveTextContent(/préparés à l’audit/);
    fireEvent.keyDown(screen.getByRole('tab', { selected: true }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Études stratégiques');
  });

  it('signale que les témoignages sont des exemples', () => {
    renderSection();
    expect(screen.getByText(/Témoignages d’exemple/)).toBeInTheDocument();
  });
});
