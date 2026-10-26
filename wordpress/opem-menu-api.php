<?php
/**
 * Plugin Name: OPEM – API du menu principal
 * Description: Rend le menu principal (Apparence > Menus) lisible par le site React, en JSON.
 * Version:     1.0.0
 * Requires PHP: 7.4
 *
 * Installation : copier ce fichier dans wp-content/mu-plugins/ (actif automatiquement).
 *
 * Utilisation dans l'administration WordPress :
 *   Apparence > Menus > créer le menu FR, cocher l'emplacement « Menu principal (FR) » ;
 *   faire de même pour l'arabe avec « Menu principal (AR) ».
 *   Sous-menus : glisser une entrée sous une autre. Deux niveaux sont affichés :
 *   les sous-pages, et leurs propres sous-pages (ex. « Diagnostic d'entreprise »).
 *   Parent sans page : utiliser un « Lien personnalisé » avec l'URL « # ».
 *   Libellé court dans la barre (ex. « Expertises » pour « Nos expertises ») :
 *   Options de l'écran > cocher « Attribut de titre », puis le remplir.
 *   L'entrée qui pointe vers l'accueil n'est pas affichée dans la barre (le logo y mène).
 *
 * Point d'accès : GET /wp-json/opem/v1/menu?lang=fr|ar
 */

defined('ABSPATH') || exit;

const OPEM_MENU_LOCATIONS = [
    'fr' => 'opem_primary_fr',
    'ar' => 'opem_primary_ar',
];
const OPEM_MENU_MAX_ITEMS = 8; // arborescence validée par OPEM

add_action('after_setup_theme', function () {
    register_nav_menus([
        OPEM_MENU_LOCATIONS['fr'] => 'Menu principal (FR)',
        OPEM_MENU_LOCATIONS['ar'] => 'Menu principal (AR)',
    ]);
});

add_action('rest_api_init', function () {
    register_rest_route('opem/v1', '/menu', [
        'methods'             => WP_REST_Server::READABLE,
        // Le menu est déjà public sur le site : lecture ouverte, aucune donnée sensible.
        'permission_callback' => '__return_true',
        'args'                => [
            'lang' => [
                'type'    => 'string',
                'enum'    => array_keys(OPEM_MENU_LOCATIONS),
                'default' => 'fr',
            ],
        ],
        'callback'            => 'opem_menu_rest_response',
    ]);
});

function opem_menu_rest_response(WP_REST_Request $request): WP_REST_Response
{
    $location  = OPEM_MENU_LOCATIONS[$request['lang']];
    $locations = get_nav_menu_locations();
    $items     = empty($locations[$location]) ? [] : wp_get_nav_menu_items($locations[$location]);

    $tree     = is_array($items) ? opem_menu_build_tree($items) : [];
    $response = new WP_REST_Response(array_slice($tree, 0, OPEM_MENU_MAX_ITEMS));
    $response->header('Cache-Control', 'public, max-age=300');

    return $response;
}

/**
 * Transforme la liste plate de WordPress en arbre à trois niveaux.
 * Les libellés sont renvoyés en texte brut (le site React les affiche comme du texte,
 * jamais comme du HTML) et les URL sont nettoyées.
 */
function opem_menu_build_tree(array $items): array
{
    $by_parent = [];
    foreach ($items as $item) {
        $by_parent[(int) $item->menu_item_parent][] = $item;
    }

    $plain = function ($text) {
        return trim(html_entity_decode(wp_strip_all_tags((string) $text), ENT_QUOTES, 'UTF-8'));
    };

    $to_node = function ($item) use ($plain) {
        return [
            'id'          => (int) $item->ID,
            'label'       => $plain($item->title),
            // Libellé court affiché dans la barre (champ « Attribut de titre »), facultatif.
            'short'       => $plain($item->attr_title),
            'url'         => esc_url_raw($item->url, ['http', 'https']) ?: '#',
            // Champ « Description » de l'entrée (Apparence > Menus > Options de l'écran > Description).
            'description' => $plain($item->description),
        ];
    };

    // Rubrique > sous-page > sous-sous-page ; les niveaux plus profonds sont ignorés.
    $build = function (int $parent_id, int $depth) use (&$build, $by_parent, $to_node) {
        return array_map(function ($item) use ($build, $depth, $to_node) {
            $node             = $to_node($item);
            $node['children'] = $depth < 2 ? $build((int) $item->ID, $depth + 1) : [];
            return $node;
        }, $by_parent[$parent_id] ?? []);
    };

    return $build(0, 0);
}
