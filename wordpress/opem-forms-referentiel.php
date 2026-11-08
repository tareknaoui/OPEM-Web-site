<?php
/**
 * Plugin Name: OPEM – Référentiel des domaines et spécialités
 * Description: Données du formulaire « Rejoindre notre réseau d’experts » (référentiel OPEM du 2026-10-02).
 * Version:     2026-10-02
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
        'D01' => [
            'label'        => '01 Stratégie, gouvernance et management',
            'specialities' => [
                'SPE-0001' => 'Diagnostic stratégique',
                'SPE-0002' => 'Planification stratégique',
                'SPE-0003' => 'Gouvernance',
                'SPE-0004' => 'Leadership',
                'SPE-0005' => 'Management d’équipe',
                'SPE-0006' => 'Conduite du changement',
                'SPE-0115' => 'Gestion des risques et contrôle interne',
            ],
        ],
        'D02' => [
            'label'        => '02 Organisation et gestion de projets',
            'specialities' => [
                'SPE-0007' => 'Organisation et structures',
                'SPE-0008' => 'Gestion des processus',
                'SPE-0009' => 'Gestion de projet',
                'SPE-0010' => 'Gestion de programmes et de portefeuilles',
                'SPE-0012' => 'Maîtrise d’ouvrage',
            ],
        ],
        'D03' => [
            'label'        => '03 Ressources humaines',
            'specialities' => [
                'SPE-0013' => 'Recrutement',
                'SPE-0014' => 'Gestion des emplois et compétences',
                'SPE-0015' => 'Rémunération',
                'SPE-0016' => 'Paie',
                'SPE-0017' => 'Relations sociales',
                'SPE-0018' => 'Gestion des talents',
            ],
        ],
        'D04' => [
            'label'        => '04 Ingénierie des dispositifs de formation professionnelle',
            'specialities' => [
                'SPE-0111' => 'Ingénierie de dispositifs et de plans de formation',
                'SPE-0112' => 'Référentiels de métiers, d’activités et de compétences',
                'SPE-0113' => 'Approche par compétences et ingénierie de certification',
                'SPE-0114' => 'Pilotage et évaluation d’un dispositif de formation',
            ],
        ],
        'D05' => [
            'label'        => '05 Finance, comptabilité et contrôle',
            'specialities' => [
                'SPE-0019' => 'Comptabilité',
                'SPE-0020' => 'Analyse financière',
                'SPE-0021' => 'Trésorerie',
                'SPE-0022' => 'Contrôle de gestion',
                'SPE-0023' => 'Fiscalité',
                'SPE-0024' => 'Audit et révision des comptes',
            ],
        ],
        'D06' => [
            'label'        => '06 Droit et conformité',
            'specialities' => [
                'SPE-0025' => 'Droit des affaires',
                'SPE-0026' => 'Droit social',
                'SPE-0027' => 'Contrats',
                'SPE-0028' => 'Marchés publics',
                'SPE-0029' => 'Conformité réglementaire',
                'SPE-0030' => 'Prévention de la corruption',
            ],
        ],
        'D07' => [
            'label'        => '07 Qualité et systèmes de management',
            'specialities' => [
                'SPE-0031' => 'Management qualité',
                'SPE-0033' => 'Systèmes de management intégrés',
                'SPE-0034' => 'Amélioration continue',
                'SPE-0035' => 'Métrologie',
                'SPE-0036' => 'Gestion documentaire',
            ],
        ],
        'D08' => [
            'label'        => '08 HSE et sécurité industrielle',
            'specialities' => [
                'SPE-0037' => 'Santé et sécurité au travail',
                'SPE-0038' => 'Hygiène industrielle',
                'SPE-0039' => 'Sécurité des procédés',
                'SPE-0040' => 'Prévention incendie',
                'SPE-0041' => 'Analyse des accidents',
                'SPE-0042' => 'Environnement : management et conformité environnementale',
            ],
        ],
        'D09' => [
            'label'        => '09 Développement durable et transition énergétique',
            'specialities' => [
                'SPE-0043' => 'RSE et stratégie de durabilité',
                'SPE-0045' => 'Climat et carbone',
                'SPE-0046' => 'Économie circulaire',
                'SPE-0047' => 'Efficacité énergétique',
                'SPE-0048' => 'Énergies renouvelables',
            ],
        ],
        'D10' => [
            'label'        => '10 Commercial, marketing et relation client',
            'specialities' => [
                'SPE-0049' => 'Stratégie commerciale',
                'SPE-0050' => 'Vente',
                'SPE-0051' => 'Négociation commerciale',
                'SPE-0052' => 'Marketing',
                'SPE-0053' => 'Relation client',
                'SPE-0054' => 'Marketing numérique',
            ],
        ],
        'D11' => [
            'label'        => '11 Communication professionnelle',
            'specialities' => [
                'SPE-0055' => 'Communication institutionnelle',
                'SPE-0056' => 'Communication interne',
                'SPE-0057' => 'Communication de crise',
                'SPE-0058' => 'Prise de parole',
                'SPE-0059' => 'Rédaction professionnelle',
                'SPE-0060' => 'Communication interculturelle',
            ],
        ],
        'D12' => [
            'label'        => '12 Achats, logistique et chaîne d’approvisionnement',
            'specialities' => [
                'SPE-0061' => 'Achats',
                'SPE-0062' => 'Approvisionnement',
                'SPE-0063' => 'Gestion des stocks',
                'SPE-0064' => 'Entreposage',
                'SPE-0065' => 'Transport et distribution physique',
                'SPE-0066' => 'Opérations d’import-export',
                'SPE-0116' => 'Moyens généraux, parc et patrimoine',
            ],
        ],
        'D13' => [
            'label'        => '13 Systèmes d’information, numérique, données et IA',
            'specialities' => [
                'SPE-0067' => 'Gouvernance SI',
                'SPE-0068' => 'Infrastructure et réseaux',
                'SPE-0069' => 'Développement logiciel',
                'SPE-0070' => 'Bases de données',
                'SPE-0071' => 'Analyse de données et BI',
                'SPE-0072' => 'Intelligence artificielle',
                'SPE-0073' => 'Bureautique',
            ],
        ],
        'D14' => [
            'label'        => '14 Cybersécurité',
            'specialities' => [
                'SPE-0074' => 'Gouvernance cybersécurité',
                'SPE-0075' => 'Management de la sécurité de l’information',
                'SPE-0076' => 'Risques cyber',
                'SPE-0077' => 'Sécurité réseau',
                'SPE-0078' => 'Réponse aux incidents',
            ],
        ],
        'D15' => [
            'label'        => '15 Industrie : production, maintenance et génie électromécanique',
            'specialities' => [
                'SPE-0084' => 'Production et performance industrielle',
                'SPE-0085' => 'Maintenance industrielle',
                'SPE-0081' => 'Mécanique et conception mécanique',
                'SPE-0082' => 'Électricité industrielle',
                'SPE-0083' => 'Automatismes et instrumentation',
                'SPE-0086' => 'Dessin technique et conception assistée',
            ],
        ],
        'D16' => [
            'label'        => '16 Pédagogie et développement des compétences',
            'specialities' => [
                'SPE-0087' => 'Ingénierie pédagogique',
                'SPE-0088' => 'Conception de programmes',
                'SPE-0090' => 'Formation de formateurs et techniques d’animation',
                'SPE-0091' => 'Évaluation des acquis',
                'SPE-0092' => 'Formation à distance',
                'SPE-0093' => 'Didactique des langues',
            ],
        ],
        'D17' => [
            'label'        => '17 BTPH, génie civil et infrastructures',
            'specialities' => [
                'SPE-0080' => 'Génie civil, structures et géotechnique',
                'SPE-0094' => 'Conduite et organisation de chantier',
                'SPE-0095' => 'Planification et ordonnancement des travaux',
                'SPE-0096' => 'Métré, études de prix et économie de la construction',
                'SPE-0097' => 'Maîtrise d’œuvre, contrôle technique et qualité des ouvrages',
                'SPE-0098' => 'Infrastructures : routes, VRD, hydraulique et topographie',
            ],
        ],
        'D18' => [
            'label'        => '18 Entrepreneuriat et appui aux TPE et PME',
            'specialities' => [
                'SPE-0099' => 'Accompagnement à la création d’entreprise',
                'SPE-0100' => 'Modèle économique et plan d’affaires',
                'SPE-0101' => 'Structuration et croissance des TPE et PME',
                'SPE-0102' => 'Dispositifs d’appui, financement et incubation',
            ],
        ],
        'D19' => [
            'label'        => '19 Développement territorial et gouvernance locale',
            'specialities' => [
                'SPE-0103' => 'Organisation et fonctionnement des collectivités locales',
                'SPE-0104' => 'Services publics locaux et relation à l’usager',
                'SPE-0105' => 'Finances et budget des collectivités',
                'SPE-0106' => 'Planification et développement local',
            ],
        ],
        'D20' => [
            'label'        => '20 Suivi-évaluation de projets et de politiques publiques',
            'specialities' => [
                'SPE-0107' => 'Cadre logique et conception de projets',
                'SPE-0108' => 'Indicateurs et systèmes de suivi',
                'SPE-0109' => 'Évaluation de projets et de politiques publiques',
                'SPE-0110' => 'Redevabilité et rapportage aux bailleurs',
            ],
        ],
    ];
}
