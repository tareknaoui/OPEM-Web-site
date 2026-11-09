import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { company } from '@/config/company';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ContactBand } from './ContactBand';

function renderBand() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <ContactBand />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Bloc « Premier échange »', () => {
  it('le bouton de rendez-vous, le téléphone et le courriel', () => {
    renderBand();
    const band = screen.getByRole('region', {
      name: 'Ce qui attend aujourd’hui coûte davantage demain.',
    });
    expect(within(band).getByRole('link', { name: /Parlons de votre projet/ })).toHaveAttribute(
      'href',
      QUOTE_HREF,
    );
    expect(
      within(band).getByRole('link', { name: `Appeler le ${company.phone.display}` }),
    ).toHaveAttribute('href', company.phone.href);
    expect(within(band).getByRole('link', { name: /general@opem-dz\.com/ })).toHaveAttribute(
      'href',
      `mailto:${company.email}`,
    );
  });

  it('passe en arabe', () => {
    renderBand();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('link', { name: /لنتحدث عن مشروعكم/ })).toBeInTheDocument();
  });
});
