import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { JOIN_HREF, QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import ContactPage from './ContactPage';

function renderContact() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <ContactPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Contact »', () => {
  it('mène aux deux formulaires', () => {
    renderContact();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nous contacter');
    expect(screen.getByRole('link', { name: 'Parlons de votre projet' })).toHaveAttribute(
      'href',
      QUOTE_HREF,
    );
    expect(screen.getByRole('link', { name: 'Rejoindre notre réseau' })).toHaveAttribute(
      'href',
      JOIN_HREF,
    );
  });

  it('coordonnées et carte, depuis la source unique', () => {
    renderContact();
    expect(screen.getByRole('link', { name: 'Appeler le 06 61 11 94 23' })).toHaveAttribute(
      'href',
      'tel:+213661119423',
    );
    expect(screen.getByRole('link', { name: 'general@opem-dz.com' })).toHaveAttribute(
      'href',
      'mailto:general@opem-dz.com',
    );
    expect(screen.getByText('16, rue La Bruyère, Bouzaréah, Alger')).toBeInTheDocument();
    const map = screen.getByTitle(/OPEM, 16, rue La Bruyère/);
    expect(map.getAttribute('src')).toMatch(/^https:\/\/www\.google\.com\/maps\?q=OPEM/);
    expect(map).toHaveAttribute('loading', 'lazy');
  });

  it('passe en arabe', () => {
    renderContact();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('تواصلوا معنا');
    expect(screen.getByTitle(/OPEM/).getAttribute('src')).toContain('hl=ar');
  });
});
