import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import TrainingShowcasePage from './TrainingShowcasePage';

function renderPage(id = 'diagnostic-d-organisation') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <TrainingShowcasePage />
    </>
  );
  const router = createMemoryRouter(
    [{ path: '/formation/fiches-formation/:id', Component: Page }],
    { initialEntries: [`/formation/fiches-formation/${id}`] },
  );
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page vitrine d’une formation', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-16T10:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('le titre, le sous-titre, la référence et toutes les rubriques du modèle', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Diagnostic d’organisation',
    );
    expect(screen.getByText('Repérer les blocages, optimiser les processus.')).toBeInTheDocument();
    expect(screen.getAllByText('D02-26.INTER.01. V1').length).toBeGreaterThanOrEqual(3);
    const sections = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(sections).toEqual([
      'Constater un blocage ne suffit pas : il faut le prouver, puis le corriger.',
      'Quatre temps forts, de l’analyse à l’action',
      'Vous repartez avec du concret',
      'Public, prérequis et contenu de la session',
      'La parole aux participants',
      'OPEM en chiffres',
      'Recevez la fiche technique détaillée et votre devis',
    ]);
    // Les quatre temps forts, puis « Pour qui », « Prérequis » et « La session comprend ».
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Cadrer et collecter',
      'Lire l’organisation',
      'Comprendre et décider',
      'Convaincre et agir',
      'Pour qui',
      'Prérequis',
      'La session comprend',
    ]);
    expect(screen.getByText(/Contenu protégé/)).toBeInTheDocument();
  });

  it('du texte découpé : singularité encadrée, fonctions en étiquettes, session en éléments', () => {
    renderPage();
    expect(screen.getByText('Sa singularité')).toBeInTheDocument();
    expect(screen.getByText('Dirigeants de PME')).toBeInTheDocument();
    for (const entry of [
      'Repas et pauses-café',
      'Supports et outils remis à chaque participant',
      'Test final des connaissances',
      'Attestation de participation',
    ]) {
      expect(screen.getByText(entry)).toBeInTheDocument();
    }
  });

  it('la barre d’ancres mène à chaque bloc de la page', () => {
    renderPage();
    const tabs = screen.getByRole('navigation', { name: 'Sur cette page' });
    const targets = within(tabs)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(targets).toEqual(['#pourquoi', '#temps-forts', '#emportez', '#public', '#temoignages']);
    for (const target of targets) {
      expect(document.getElementById(target!.slice(1))).toBeInTheDocument();
    }
  });

  it('l’encadré « session » : dates de l’agenda, durée, horaires, effectif, lieu et demande', () => {
    renderPage();
    const facts = screen.getByRole('complementary', { name: 'Dates, durée, effectif et lieu' });
    expect(facts).toHaveTextContent('6 au 9 décembre 2026');
    expect(
      within(facts).getByRole('link', { name: /Demander la fiche technique et un devis/ }),
    ).toHaveAttribute('href', '#demande');
    expect(facts).toHaveTextContent(/4\sjours/);
    expect(facts).toHaveTextContent(/de 9\sh à 16\sh/);
    expect(facts).toHaveTextContent(/12\sparticipants/);
    expect(facts).toHaveTextContent('École OPEM');
  });

  it('n’affiche ni tarif ni programme détaillé', () => {
    renderPage();
    expect(screen.queryByText(/\bDA\b|dinars|€/)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Le programme détaillé figure dans la fiche technique, adressée sur demande.',
      ),
    ).toBeInTheDocument();
  });

  it('la demande en haut et en bas de page ; le courriel est prérempli', () => {
    renderPage();
    const links = screen.getAllByRole('link', { name: /Demander la fiche technique et un devis/ });
    expect(links.length).toBeGreaterThanOrEqual(2);
    const request = screen.getByRole('region', {
      name: 'Recevez la fiche technique détaillée et votre devis',
    });
    const mail = within(request).getByRole('link', {
      name: /Demander la fiche technique et un devis/,
    });
    const href = decodeURIComponent(mail.getAttribute('href') ?? '');
    expect(href).toMatch(/^mailto:formations@opem-dz\.com\?subject=/);
    expect(href).toContain('réf. D02-26.INTER.01. V1');
    expect(href).toContain('session du 6 au 9 décembre 2026');
  });

  it('masque le bandeau d’appel du pied de page tant qu’elle est affichée', () => {
    const { unmount } = renderPage();
    expect(document.documentElement).toHaveAttribute('data-footer-cta', 'off');
    unmount();
    expect(document.documentElement).not.toHaveAttribute('data-footer-cta');
  });

  it('une formation sans vitrine : la page « Formation qualifiante »', () => {
    renderPage('plan-de-formation-2027');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Une compétence se construit, puis s’éprouve au travail.',
    );
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('تشخيص التنظيم');
  });
});
