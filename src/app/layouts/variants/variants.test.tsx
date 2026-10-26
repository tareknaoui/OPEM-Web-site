import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { Footer } from '../footer/Footer';
import { Navbar } from '../navbar/Navbar';
import { setLayoutVariant, useLayoutVariants } from './layoutVariants';
import { VariantSwitcher } from './VariantSwitcher';

function renderWithRouter(node: ReactNode) {
  const Page = () => <>{node}</>;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

const logoSrc = (container: HTMLElement, scope: string) =>
  container.querySelector(`${scope} img`)?.getAttribute('src');

afterEach(() => {
  vi.restoreAllMocks();
  setLayoutVariant('navbar', 'nuit');
  setLayoutVariant('footer', 'nuit');
});

describe('Maquettes de barre de navigation', () => {
  it('version 1 (par défaut) : logo blanc', () => {
    const { container } = renderWithRouter(<Navbar />);
    expect(logoSrc(container, 'header')).toBe('/logo-opem.svg');
  });

  it('version 2 « blanche » : logo couleur', () => {
    const { container } = renderWithRouter(<Navbar variant="blanche" />);
    expect(logoSrc(container, 'header')).toBe('/logo-opem-couleur.svg');
  });

  it('version 3 « flottante » : logo couleur', () => {
    const { container } = renderWithRouter(<Navbar variant="flottante" />);
    expect(logoSrc(container, 'header')).toBe('/logo-opem-couleur.svg');
  });

  it('version 4 « logo centré » : téléphone dans la barre', () => {
    renderWithRouter(<Navbar variant="centree" />);
    expect(
      within(screen.getByRole('banner')).getByRole('link', { name: '06 61 11 94 23' }),
    ).toHaveAttribute('href', 'tel:+213661119423');
  });

  it('version 5 « plein écran » : le bouton Menu ouvre le grand menu sur ordinateur', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as MediaQueryList);
    renderWithRouter(<Navbar variant="pleinecran" />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('id', 'fullscreen-menu');
    expect(within(dialog).getByRole('button', { name: 'Nos expertises' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(within(dialog).getByRole('link', { name: /Études stratégiques/ })).toBeInTheDocument();

    fireEvent.mouseEnter(within(dialog).getByRole('button', { name: 'Formation qualifiante' }));
    expect(
      within(dialog).getByRole('link', { name: /Tout voir — Formation qualifiante/ }),
    ).toHaveAttribute('href', '/formation');
  });

  it('version 6 « éditoriale » : logo couleur, sous-menu pleine largeur avec « Tout voir »', () => {
    const { container } = renderWithRouter(<Navbar variant="editoriale" />);
    expect(logoSrc(container, 'header')).toBe('/logo-opem-couleur.svg');
    const links = within(screen.getByRole('banner')).getAllByRole('link', { name: 'Tout voir' });
    expect(links.map((link) => link.getAttribute('href'))).toContain('/expertises');
  });

  it('version 7 « éditoriale bleu nuit » : logo blanc, même sous-menu pleine largeur', () => {
    const { container } = renderWithRouter(<Navbar variant="editorialenuit" />);
    expect(logoSrc(container, 'header')).toBe('/logo-opem.svg');
    const links = within(screen.getByRole('banner')).getAllByRole('link', { name: 'Tout voir' });
    expect(links.map((link) => link.getAttribute('href'))).toContain('/expertises');
  });

  it('version 8 « prestige » : introduction de rubrique et encart rendez-vous, sauf dans Contact', () => {
    renderWithRouter(<Navbar variant="prestige" />);
    const banner = within(screen.getByRole('banner'));
    expect(banner.getByText(/Du diagnostic à la certification/)).toBeInTheDocument();
    // Une rubrique sur six contient déjà « Demande de rendez-vous » : pas d'encart dans celle-ci.
    const features = banner.getAllByRole('link', { name: /Prendre rendez-vous/ });
    expect(features).toHaveLength(5);
    expect(features[0]).toHaveAttribute('href', '/contact/demande-de-rendez-vous');
  });
});

describe('Maquettes de pied de page', () => {
  it('version 2 « clair » : logo couleur', () => {
    const { container } = renderWithRouter(<Footer variant="clair" />);
    expect(logoSrc(container, 'footer')).toBe('/logo-opem-couleur.svg');
  });

  it('version 3 « compact » : rubriques, coordonnées et bouton de rappel', () => {
    renderWithRouter(<Footer variant="compact" />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Nos expertises' })).toHaveAttribute(
      'href',
      '/expertises',
    );
    expect(within(footer).getByRole('link', { name: 'Être rappelé' })).toBeInTheDocument();
    expect(within(footer).getByText(/16, rue La Bruyère/)).toBeInTheDocument();
  });
});

describe('Sélecteur de maquettes', () => {
  it('applique le choix en direct', () => {
    const Probe = () => {
      const { navbar, footer } = useLayoutVariants();
      return <output>{`${navbar}/${footer}`}</output>;
    };
    render(
      <>
        <VariantSwitcher />
        <Probe />
      </>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('nuit/nuit');

    fireEvent.click(screen.getByRole('radio', { name: /2\. Blanche/ }));
    fireEvent.click(screen.getByRole('radio', { name: /2\. Clair/ }));
    expect(screen.getByRole('status')).toHaveTextContent('blanche/clair');
  });
});
