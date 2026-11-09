/*
 * Icônes de la page « Le cabinet » (Phosphor, licence MIT), importées une à une pour n'embarquer
 * que celles-ci. Affichées en duotone, décoratives (aria-hidden) : le texte porte le sens.
 */
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowsClockwise';
import { BriefcaseIcon } from '@phosphor-icons/react/dist/csr/Briefcase';
import { BuildingsIcon } from '@phosphor-icons/react/dist/csr/Buildings';
import { CalendarCheckIcon } from '@phosphor-icons/react/dist/csr/CalendarCheck';
import { CertificateIcon } from '@phosphor-icons/react/dist/csr/Certificate';
import { ChalkboardTeacherIcon } from '@phosphor-icons/react/dist/csr/ChalkboardTeacher';
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { EarIcon } from '@phosphor-icons/react/dist/csr/Ear';
import { FileTextIcon } from '@phosphor-icons/react/dist/csr/FileText';
import { GaugeIcon } from '@phosphor-icons/react/dist/csr/Gauge';
import { GlobeHemisphereWestIcon } from '@phosphor-icons/react/dist/csr/GlobeHemisphereWest';
import { HandHeartIcon } from '@phosphor-icons/react/dist/csr/HandHeart';
import { IdentificationBadgeIcon } from '@phosphor-icons/react/dist/csr/IdentificationBadge';
import { LightningIcon } from '@phosphor-icons/react/dist/csr/Lightning';
import { LockKeyIcon } from '@phosphor-icons/react/dist/csr/LockKey';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { PathIcon } from '@phosphor-icons/react/dist/csr/Path';
import { PencilRulerIcon } from '@phosphor-icons/react/dist/csr/PencilRuler';
import { SealCheckIcon } from '@phosphor-icons/react/dist/csr/SealCheck';
import { StampIcon } from '@phosphor-icons/react/dist/csr/Stamp';
import { TargetIcon } from '@phosphor-icons/react/dist/csr/Target';
import { UsersFourIcon } from '@phosphor-icons/react/dist/csr/UsersFour';
import { UsersThreeIcon } from '@phosphor-icons/react/dist/csr/UsersThree';

/** 04 : écouter, construire, conduire, mesurer. */
export const STEP_ICONS = [EarIcon, PencilRulerIcon, CompassIcon, TargetIcon];

/**
 * 05 : excellence (la loupe : le diable se cache dans les détails), professionnalisme, délais,
 * confidentialité, réactivité, engagement citoyen.
 */
export const VALUE_ICONS = [
  MagnifyingGlassIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  LockKeyIcon,
  LightningIcon,
  HandHeartIcon,
];

/** 07 : parcours, sélection, pédagogie, mobilisation, portée. */
export const TRAIT_ICONS = [
  PathIcon,
  SealCheckIcon,
  ChalkboardTeacherIcon,
  UsersThreeIcon,
  GlobeHemisphereWestIcon,
];

/** 08 : agrément, habilitation, groupes, double évaluation, rapport, exigence chiffrée. */
export const GUARANTEE_ICONS = [
  CertificateIcon,
  StampIcon,
  UsersFourIcon,
  ArrowsClockwiseIcon,
  FileTextIcon,
  GaugeIcon,
];

/** 09 : l'organisation, l'expert. */
export const DOOR_ICONS = { client: BuildingsIcon, expert: IdentificationBadgeIcon };
