import type { ComponentType } from 'react';
import { CyberArt } from './art/CyberArt';
import { DiagnosticArt } from './art/DiagnosticArt';
import { PlanArt } from './art/PlanArt';

/*
 * Les illustrations des pages formation, dessinées dans la page (et non en image) pour être
 * animées. Chaque dessin d'OPEM (art/<id>.svg, version pour fond bleu nuit) est préparé une
 * fois : classes « a-… » sur les pièces à animer (montée à l'arrivée, personnages, flux en
 * pointillés, signaux), lues par TrainingShowcasePage.module.css, et paquets en mouvement
 * (SMIL) ; puis converti en composant React (art/*.tsx). Aucun script, aucun attribut style.
 */
export const ARTWORK: Record<string, ComponentType> = {
  'diagnostic-d-organisation': DiagnosticArt,
  'plan-de-formation-2027': PlanArt,
  'cybersecurite-operationnelle': CyberArt,
};
