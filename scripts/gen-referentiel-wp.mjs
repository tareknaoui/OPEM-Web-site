// Génère wordpress/opem-forms-referentiel.php à partir de src/features/forms/referentiel.json :
// les 20 domaines et leurs spécialités (identifiants SPE, intitulés français), pour que le
// serveur vérifie les choix reçus et écrive le message à OPEM. Une seule source : le JSON.
// Lancer après toute modification du référentiel : node scripts/gen-referentiel-wp.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const { version, domains } = JSON.parse(
  readFileSync('src/features/forms/referentiel.json', 'utf8'),
);

const php = (text) => `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;

const body = domains
  .map(
    (domain) =>
      `        ${php(domain.id)} => [\n            'label'        => ${php(domain.fr)},\n            'specialities' => [\n${domain.specialities
        .map((s) => `                ${php(s.id)} => ${php(s.fr)},`)
        .join('\n')}\n            ],\n        ],`,
  )
  .join('\n');

const file = `<?php
/**
 * Plugin Name: OPEM – Référentiel des domaines et spécialités
 * Description: Données du formulaire « Rejoindre notre réseau d’experts » (référentiel OPEM du ${version}).
 * Version:     ${version}
 *
 * Fichier généré par scripts/gen-referentiel-wp.mjs à partir de src/features/forms/referentiel.json :
 * modifier le JSON puis relancer le script, plutôt que ce fichier. À copier dans
 * wp-content/mu-plugins/ avec opem-forms-api.php.
 */

defined('ABSPATH') || exit;

/** Domaines (D01…D20) et leurs spécialités (identifiant SPE => intitulé français). */
function opem_forms_referentiel(): array
{
    return [
${body}
    ];
}
`;

writeFileSync('wordpress/opem-forms-referentiel.php', file);
console.log('écrit wordpress/opem-forms-referentiel.php :', domains.length, 'domaines');
