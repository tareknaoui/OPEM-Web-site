import { Icon, MapPinIcon, type IconProps } from '@/components/icons';
import type { AudienceIcon, MarkerIcon, NeedIcon } from './content';

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

const markerIcons: Record<MarkerIcon, (props: IconProps) => React.JSX.Element> = {
  domains: (props) => (
    <Icon {...props}>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </Icon>
  ),
  sectors: (props) => (
    <Icon {...props}>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </Icon>
  ),
  map: MapPinIcon,
};

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

export function MarkerPictogram({ name, ...props }: IconProps & { name: MarkerIcon }) {
  const Pictogram = markerIcons[name];
  return <Pictogram strokeWidth={1.8} {...props} />;
}
