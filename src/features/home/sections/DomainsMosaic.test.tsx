import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { DomainsMosaic } from './DomainsMosaic';

function renderMosaic(layout?: 'mosaique' | 'rangee' | 'coin') {
  const Page = () => <DomainsMosaic domains={homeContent.fr.domains} layout={layout} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('« Nos domaines », version mosaïque', () => {
  it('affiche tous les domaines en même temps, chacun avec son lien', () => {
    renderMosaic();
    const { items } = homeContent.fr.domains;
    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles.map((title) => title.textContent)).toEqual(items.map((item) => item.title));
    for (const item of items) {
      expect(screen.getByRole('link', { name: item.title })).toHaveAttribute('href', item.href);
      expect(screen.getByText(item.text)).toBeVisible();
    }
    // Aucun carrousel : ni onglets ni bouton pause.
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('propose d’être rappelé', () => {
    renderMosaic();
    expect(screen.getByRole('link', { name: /Être rappelé/ })).toHaveAttribute('href', '/contact');
  });

  it('en rangée, affiche les 6 domaines ensemble, chacun avec son illustration', () => {
    renderMosaic('rangee');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    const sources = [...document.querySelectorAll('img')].map((img) => img.getAttribute('src'));
    expect(sources).toEqual(homeContent.fr.domains.items.map((item) => item.illustration));
    expect(sources[0]).toBe('/images/domaines/illustrations/etudes-strategiques.webp');
  });

  it('en coin, garde les cartes et met la vignette de chaque illustration', () => {
    renderMosaic('coin');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    const sources = [...document.querySelectorAll('img')].map((img) => img.getAttribute('src'));
    expect(sources).toEqual(homeContent.fr.domains.items.map((item) => item.emblem));
    expect(sources[5]).toBe('/images/domaines/emblemes/certification.webp');
  });
});
