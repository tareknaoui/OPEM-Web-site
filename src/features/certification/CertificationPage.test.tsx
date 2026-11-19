import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import CertificationPage from './CertificationPage';
import { FAMILY_IDS } from './content';

function renderPage(path = '/expertises/certification-et-accreditation') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <CertificationPage />
    </>
  );
  const router = createMemoryRouter(
    [{ path: '/expertises/certification-et-accreditation/*', Component: Page }],
    { initialEntries: [path] },
  );
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Certification et accréditation »', () => {
  it('l’accroche en titre, deux actions, des photos décrites', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent?.replace(/\s/g, ' ')).toBe(
      'Un certificat rassure ; une pratique convainc.',
    );
    expect(screen.getByRole('link', { name: /Préparer votre certification/ })).toHaveAttribute(
      'href',
      '/contact/demande-de-rendez-vous',
    );
    expect(screen.getByRole('link', { name: 'Voir les certifications' })).toHaveAttribute(
      'href',
      '#certifications',
    );
    const photos = screen.getAllByRole('img').filter((img) => img.tagName === 'IMG');
    expect(photos.length).toBeGreaterThanOrEqual(5);
    photos.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });

  it('dix référentiels en trois familles, chacune avec son ancre', () => {
    renderPage('/expertises/certification-et-accreditation/accreditation');
    FAMILY_IDS.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
    const catalogue = screen.getByRole('region', {
      name: 'Dix référentiels, un même chemin vers la confiance.',
    });
    const names = within(catalogue)
      .getAllByRole('heading', { level: 4 })
      .map((heading) => heading.textContent?.replace(/\s/g, ' '));
    expect(names).toEqual([
      'ISO 9001',
      'ISO 14001',
      'ISO 45001',
      'Marquage CE',
      'Marque TEDJ',
      'Certification Halal',
      'Label accueil « Fi Khidmatikoum »',
      'ISO/IEC 17025',
      'ISO/IEC 17020',
    ]);
  });

  it('le bandeau des badges : une rangée lue, sa copie masquée', () => {
    renderPage();
    const ribbon = screen.getByRole('region', { name: 'Les référentiels que nous préparons' });
    const rows = ribbon.querySelectorAll('ul');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toHaveAttribute('aria-hidden', 'true');
    expect(within(rows[0] as HTMLElement).getByText('Marquage CE')).toBeInTheDocument();
  });

  it('la démarche, la formation ISO 9001:2026, les références et les questions', () => {
    renderPage();
    const path = screen.getByRole('region', {
      name: 'Six étapes, de l’écart constaté au certificat obtenu.',
    });
    expect(within(path).getAllByRole('listitem')).toHaveLength(6);
    expect(within(path).getByRole('link', { name: /Formation ISO 9001:2026/ })).toHaveAttribute(
      'href',
      '/formation/fiches-formation/iso-9001-2026',
    );
    expect(screen.getByRole('heading', { name: 'Trois normes conduites de front' })).toBeVisible();
    expect(screen.getByText(/Délivrez-vous vous-mêmes/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Téléphone 06/ })).toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'الشهادة تطمئن؛ والممارسة تقنع.',
    );
  });
});
