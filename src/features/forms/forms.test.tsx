import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import AppointmentPage from './AppointmentPage';
import JoinPage from './JoinPage';
import referentiel from './referentiel.json';
import { checkFile, CV_RULE, DOCUMENT_RULE, isEmail, isPhone, MB } from './validation';

vi.mock('@/lib/env', () => ({
  env: { appName: 'OPEM', apiUrl: '/api', wpApiUrl: 'https://wp.example/wp-json', isDev: false },
}));

function renderPage(Page: () => React.JSX.Element) {
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

const type = (label: RegExp | string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const file = (name: string, size = 1000) => {
  const blob = new File(['x'], name);
  Object.defineProperty(blob, 'size', { value: size });
  return blob;
};

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(() => vi.unstubAllGlobals());

const sent = () => {
  const call = fetchMock.mock.calls[0] as [string, RequestInit] | undefined;
  return { url: call?.[0], data: call?.[1].body as FormData };
};

describe('contrôles', () => {
  it('courriel, téléphone et fichiers', () => {
    expect(isEmail('nom@domaine.dz')).toBe(true);
    expect(isEmail('nom@domaine')).toBe(false);
    expect(isPhone('0551 23 45 67')).toBe(true);
    expect(isPhone('12')).toBe(false);
    expect(checkFile(file('cv.pdf'), CV_RULE)).toBeNull();
    expect(checkFile(file('cv.docm'), CV_RULE)).toBe('format');
    expect(checkFile(file('cv.pdf', 6 * MB), CV_RULE)).toBe('size');
    expect(checkFile(file('tableau.xlsm'), DOCUMENT_RULE)).toBe('format');
    expect(checkFile(file('photo.PNG'), DOCUMENT_RULE)).toBeNull();
  });

  it('référentiel : 20 domaines, 111 spécialités aux identifiants uniques', () => {
    const ids = referentiel.domains.flatMap((d) => d.specialities.map((s) => s.id));
    expect(referentiel.domains).toHaveLength(20);
    expect(ids).toHaveLength(111);
    expect(new Set(ids).size).toBe(111);
    expect(ids.every((id) => /^SPE-\d{4}$/.test(id))).toBe(true);
  });
});

describe('Formulaire 1 : demande de rendez-vous', () => {
  it('textes mot pour mot', () => {
    renderPage(AppointmentPage);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Parlons de votre projet');
    expect(
      screen.getByText(
        'Quelques lignes suffisent pour engager l’échange. Les champs marqués d’un astérisque sont obligatoires.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Laissez vide si vous portez un projet à titre personnel.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact@opem-dz.com' })).toHaveAttribute(
      'href',
      'mailto:contact@opem-dz.com',
    );
    expect(screen.getByRole('button', { name: 'Envoyer ma demande' })).toBeInTheDocument();
    const subject = screen.getByLabelText(/Objet de votre demande/);
    expect(
      within(subject)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual([
      'Choisir…',
      'Études stratégiques',
      'Accompagnement des organisations',
      'Formation qualifiante',
      'Coaching professionnel',
      'Certification et accréditation',
      'Communication institutionnelle',
      'IA appliquée',
      'Autre demande (à préciser)',
    ]);
    // Champ 06 : deux choix, aucun présélectionné.
    const radios = within(
      screen.getByRole('group', { name: 'Votre projet concerne' }),
    ).getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios.every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
    // Les deux cases, non cochées par défaut.
    expect(screen.getAllByRole('checkbox').every((box) => !(box as HTMLInputElement).checked)).toBe(
      true,
    );
  });

  it('erreurs sous les champs obligatoires, sans effacer les saisies', () => {
    renderPage(AppointmentPage);
    type(/Nom et prénom/, 'Amina Benali');
    type(/^Courriel/, 'amina@');
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Nom et prénom/)).toHaveValue('Amina Benali');
    expect(screen.getByLabelText(/^Courriel/)).toHaveAccessibleDescription(
      'Saisissez une adresse de courriel valide, par exemple nom@domaine.dz.',
    );
    expect(screen.getByLabelText(/^Téléphone/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Cochez cette case pour envoyer votre demande.')).toBeInTheDocument();
  });

  it('« Autre demande » ouvre un champ libre ; un jour sans heure est signalé', () => {
    renderPage(AppointmentPage);
    expect(screen.queryByLabelText(/Précisez votre demande/)).toBeNull();
    type(/Objet de votre demande/, 'autre');
    expect(screen.getByLabelText(/Précisez votre demande/)).toBeInTheDocument();
    const option1 = screen.getByRole('group', { name: 'Option 1' });
    fireEvent.change(within(option1).getByLabelText('Jour'), { target: { value: 'lundi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(within(option1).getByText('Choisissez aussi une heure.')).toBeInTheDocument();
  });

  it('envoi : créneau en tête, +213 par défaut, confirmation adaptée', async () => {
    renderPage(AppointmentPage);
    type(/Nom et prénom/, 'Amina Benali');
    type(/^Courriel/, 'amina@exemple.dz');
    type(/^Téléphone/, '0551 23 45 67');
    type(/Objet de votre demande/, 'formation');
    type(/Votre message/, 'Former nos équipes qualité.');
    const option2 = screen.getByRole('group', { name: 'Option 2' });
    fireEvent.change(within(option2).getByLabelText('Jour'), { target: { value: 'mardi' } });
    fireEvent.change(within(option2).getByLabelText('Heure'), { target: { value: '10' } });
    fireEvent.click(screen.getByLabelText(/J’accepte que les informations saisies/));
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(
      await screen.findByText(
        'Merci, votre demande nous est bien parvenue. Nous vous contactons pour confirmer l’un des créneaux proposés.',
      ),
    ).toBeInTheDocument();
    const { url, data } = sent();
    expect(url).toBe('https://wp.example/wp-json/opem/v1/rendez-vous');
    expect(data.get('phoneCode')).toBe('+213');
    expect(data.get('slot2Day')).toBe('mardi');
    expect(data.get('slot2Hour')).toBe('10');
    expect(data.get('consent')).toBe('1');
    expect(data.get('newsletter')).toBe('');
    expect(data.get('project')).toBe('');
  });

  it('sans créneau : l’autre message de confirmation', async () => {
    renderPage(AppointmentPage);
    type(/Nom et prénom/, 'Amina Benali');
    type(/^Courriel/, 'amina@exemple.dz');
    type(/^Téléphone/, '551234567');
    type(/Objet de votre demande/, 'ia');
    type(/Votre message/, 'Un premier échange.');
    fireEvent.click(screen.getByLabelText(/J’accepte que les informations saisies/));
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(
      await screen.findByText(
        'Merci, votre demande nous est bien parvenue. Nous vous contactons pour convenir d’un premier échange.',
      ),
    ).toBeInTheDocument();
  });
});

describe('Formulaire 2 : rejoindre notre réseau d’experts', () => {
  it('textes mot pour mot ; les spécialités suivent les domaines cochés', () => {
    renderPage(JoinPage);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Rejoindre notre réseau d’experts',
    );
    expect(screen.getByText('PDF ou Word, 5 Mo au plus')).toBeInTheDocument();
    expect(screen.queryByLabelText('Diagnostic stratégique')).toBeNull();
    fireEvent.click(screen.getByLabelText('01 Stratégie, gouvernance et management'));
    const group = screen.getByRole('group', { name: '01 Stratégie, gouvernance et management' });
    expect(
      within(group)
        .getAllByRole('checkbox')
        .map((box) => box.parentElement?.textContent),
    ).toEqual([
      'Diagnostic stratégique',
      'Planification stratégique',
      'Gouvernance',
      'Leadership',
      'Management d’équipe',
      'Conduite du changement',
      'Gestion des risques et contrôle interne',
      'Autre à préciser',
    ]);
    fireEvent.click(screen.getByLabelText('01 Stratégie, gouvernance et management'));
    expect(screen.queryByLabelText('Diagnostic stratégique')).toBeNull();
  });

  it('fichiers refusés avec un message clair', () => {
    renderPage(JoinPage);
    const cv = screen.getByLabelText(/Curriculum vitæ/);
    fireEvent.change(cv, { target: { files: [file('cv.docm')] } });
    expect(
      screen.getByText('Ce format n’est pas accepté. Envoyez un fichier PDF ou Word.'),
    ).toBeInTheDocument();
    const documents = screen.getByLabelText(/Autres documents/);
    fireEvent.change(documents, { target: { files: [file('photo.heic')] } });
    expect(
      screen.getByText(
        'Ce format n’est pas accepté. Envoyez un fichier PDF, Word, Excel, JPG ou PNG. Pour une photo prise sur iPhone, enregistrez-la d’abord en JPG.',
      ),
    ).toBeInTheDocument();
    fireEvent.change(documents, { target: { files: [file('diplome.pdf', 11 * MB)] } });
    expect(screen.getByText('Ce fichier dépasse la taille autorisée.')).toBeInTheDocument();
  });

  it('envoi : identifiants SPE, CV et documents, deux cases obligatoires', async () => {
    renderPage(JoinPage);
    type(/Nom et prénom/, 'Karim Haddad');
    type(/^Courriel/, 'karim@exemple.dz');
    type(/^Téléphone/, '0661 00 11 22');
    fireEvent.click(screen.getByLabelText('Consultant et formateur'));
    fireEvent.click(screen.getByLabelText('07 Qualité et systèmes de management'));
    fireEvent.click(screen.getByLabelText('Métrologie'));
    fireEvent.change(screen.getByLabelText(/Curriculum vitæ/), {
      target: { files: [file('cv.pdf')] },
    });
    fireEvent.change(screen.getByLabelText(/Autres documents/), {
      target: { files: [file('diplome.pdf'), file('attestation.jpg')] },
    });
    fireEvent.click(screen.getByLabelText(/J’accepte que les informations et le CV/));

    // Sans la case « Présentation aux clients », l'envoi est impossible.
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma candidature' }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/J’accepte qu’OPEM présente mon profil/)).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    fireEvent.click(screen.getByLabelText(/J’accepte qu’OPEM présente mon profil/));
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma candidature' }));
    expect(
      await screen.findByText(
        'Merci, votre candidature est bien enregistrée. Nous reviendrons vers vous dès qu’une mission correspondra à votre profil.',
      ),
    ).toBeInTheDocument();
    const { url, data } = sent();
    expect(url).toBe('https://wp.example/wp-json/opem/v1/candidature');
    expect(data.getAll('domains[]')).toEqual(['D07']);
    expect(data.getAll('specialities[]')).toEqual(['SPE-0035']);
    expect(data.get('role')).toBe('consultant-formateur');
    expect((data.get('cv') as File).name).toBe('cv.pdf');
    expect(data.getAll('documents[]')).toHaveLength(2);
    expect(data.get('presentation')).toBe('1');
  });

  it('erreurs du serveur affichées sous les champs', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('{"code":"invalid","errors":{"cv":"format"}}', { status: 422 }),
    );
    renderPage(JoinPage);
    type(/Nom et prénom/, 'Karim Haddad');
    type(/^Courriel/, 'karim@exemple.dz');
    type(/^Téléphone/, '661001122');
    fireEvent.click(screen.getByLabelText('Formateur'));
    fireEvent.click(screen.getByLabelText('03 Ressources humaines'));
    fireEvent.click(screen.getByLabelText('Paie'));
    fireEvent.change(screen.getByLabelText(/Curriculum vitæ/), {
      target: { files: [file('cv.pdf')] },
    });
    fireEvent.click(screen.getByLabelText(/J’accepte que les informations et le CV/));
    fireEvent.click(screen.getByLabelText(/J’accepte qu’OPEM présente mon profil/));
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma candidature' }));
    await waitFor(() =>
      expect(
        screen.getByText('Ce format n’est pas accepté. Envoyez un fichier PDF ou Word.'),
      ).toBeInTheDocument(),
    );
  });
});
