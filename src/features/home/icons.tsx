import { Icon, type IconProps } from '@/components/icons';
import type { AudienceIcon, CommitmentIcon, NeedIcon } from './content';

// Pictogrammes de l'accueil (trait simple, couleur héritée : vert OPEM sur fond blanc).

const needIcons: Record<NeedIcon, (props: IconProps) => React.JSX.Element> = {
  strategy: (props) => (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z" />
    </Icon>
  ),
  organization: (props) => (
    <Icon {...props}>
      <rect x="9" y="2" width="6" height="5" rx="1" />
      <rect x="2" y="17" width="6" height="5" rx="1" />
      <rect x="16" y="17" width="6" height="5" rx="1" />
      <path d="M12 7v5M5 17v-5h14v5" />
    </Icon>
  ),
  certification: (props) => (
    <Icon {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
    </Icon>
  ),
  training: (props) => (
    <Icon {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </Icon>
  ),
  coaching: (props) => (
    <Icon {...props}>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M21 21v-2a4 4 0 0 0-3-3.9" />
    </Icon>
  ),
  safety: (props) => (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  ),
};

const commitmentIcons: Record<CommitmentIcon, (props: IconProps) => React.JSX.Element> = {
  // Personne et flèche montante : les équipes du client progressent et prennent le relais.
  relay: (props) => (
    <Icon {...props}>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M3 21v-1.5A5.5 5.5 0 0 1 8.5 14H11" />
      <path d="m14 21 7-7M16 14h5v5" />
    </Icon>
  ),
  // Cadenas : confidentialité.
  lock: (props) => (
    <Icon {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2.5" />
    </Icon>
  ),
  // Repère planté sur un relief : des spécialistes qui connaissent le terrain.
  field: (props) => (
    <Icon {...props}>
      <path d="M12 12s4.5-3.8 4.5-7.25a4.5 4.5 0 0 0-9 0C7.5 8.2 12 12 12 12Z" />
      <circle cx="12" cy="4.75" r="1.5" />
      <path d="m2 21 5.5-6 3.5 3.5 3-3 8 5.5" />
    </Icon>
  ),
};

export function CommitmentPictogram({ name, ...props }: IconProps & { name: CommitmentIcon }) {
  const Pictogram = commitmentIcons[name];
  return <Pictogram strokeWidth={1.6} {...props} />;
}

const audienceIcons: Record<AudienceIcon, (props: IconProps) => React.JSX.Element> = {
  // Bâtiment public à colonnes.
  public: (props) => (
    <Icon {...props}>
      <path d="M3 21h18M4 18h16M12 3 3 8h18l-9-5Z" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
    </Icon>
  ),
  // Mallette.
  company: (props) => (
    <Icon {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </Icon>
  ),
};

export function AudiencePictogram({ name, ...props }: IconProps & { name: AudienceIcon }) {
  const Pictogram = audienceIcons[name];
  return <Pictogram strokeWidth={1.6} {...props} />;
}

export function NeedPictogram({ name, ...props }: IconProps & { name: NeedIcon }) {
  const Pictogram = needIcons[name];
  return <Pictogram strokeWidth={1.6} {...props} />;
}
