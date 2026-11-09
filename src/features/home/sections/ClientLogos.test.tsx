import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { ClientLogos } from './ClientLogos';

const { clients } = homeContent.fr;

describe('Bandeau des logos clients', () => {
  it('présente chaque client une fois aux lecteurs d’écran, avec son nom', () => {
    render(<ClientLogos clients={clients} />);
    const section = screen.getByRole('region', { name: 'Ils nous font confiance' });
    // La rangée boucle : chaque client lu une seule fois, les copies masquées.
    const logos = within(section).getAllByRole('img');
    expect(logos.map((logo) => logo.getAttribute('alt'))).toEqual(
      clients.items.map((item) => item.name),
    );
    expect(logos[0]).toHaveAttribute('src', '/images/clients/pnud.webp');
    // Exactement les 42 logos de « LOGO CLIENTS.docx ».
    expect(clients.items).toHaveLength(42);
    expect(section.querySelectorAll('ul[aria-hidden="true"] img[alt=""]')).toHaveLength(
      clients.items.length * 2,
    );
  });
});
