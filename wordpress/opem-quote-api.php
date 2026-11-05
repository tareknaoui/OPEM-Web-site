<?php
/**
 * Plugin Name: OPEM – Citation du mois
 * Description: Page de réglage « Citation du mois » (FR et AR), lue par le site React en JSON.
 * Version:     1.0.0
 * Requires PHP: 7.4
 *
 * Installation : copier ce fichier dans wp-content/mu-plugins/ (actif automatiquement).
 *
 * Utilisation dans l'administration WordPress, chaque mois :
 *   Réglages > Citation du mois : remplir la citation, l'auteur, la source (l'ouvrage, affiché
 *   en italique) et le commentaire d'OPEM, en français et en arabe, puis « Enregistrer ».
 *   Sans guillemets : le site les ajoute. Citation ou auteur vide : le site garde sa citation
 *   intégrée. Source ou commentaire vide : la ligne n'est pas affichée.
 *   La nouvelle citation apparaît sur le site en 5 minutes au plus (cache).
 *
 * Point d'accès : GET /wp-json/opem/v1/quote?lang=fr|ar
 */

defined('ABSPATH') || exit;

const OPEM_QUOTE_OPTION = 'opem_quote_of_month';
const OPEM_QUOTE_LANGS  = ['fr' => 'Français', 'ar' => 'العربية'];
const OPEM_QUOTE_FIELDS = [
    'quote'   => ['Citation', 300],
    'author'  => ['Auteur', 80],
    'source'  => ['Source (ouvrage)', 80],
    'comment' => ['Commentaire d’OPEM', 400],
];

add_action('admin_init', function () {
    register_setting('opem_quote', OPEM_QUOTE_OPTION, [
        'type'              => 'array',
        'sanitize_callback' => 'opem_quote_sanitize',
        'default'           => [],
    ]);
});

/** Texte brut uniquement, longueurs bornées (le site revalide aussi la réponse). */
function opem_quote_sanitize($input): array
{
    $clean = [];
    foreach (array_keys(OPEM_QUOTE_LANGS) as $lang) {
        foreach (OPEM_QUOTE_FIELDS as $field => [, $max]) {
            $value = $input[$lang][$field] ?? '';
            $value = sanitize_textarea_field(is_string($value) ? $value : '');
            // Guillemets saisis par erreur autour de la citation : retirés (le site les ajoute).
            if ($field === 'quote') {
                $value = trim($value, " \t\n\r\"«»“”");
            }
            $clean[$lang][$field] = mb_substr(trim($value), 0, $max);
        }
    }
    return $clean;
}

add_action('admin_menu', function () {
    add_options_page('Citation du mois', 'Citation du mois', 'edit_pages', 'opem-quote', 'opem_quote_page');
});

// Les éditeurs (droit edit_pages) peuvent enregistrer la citation, pas seulement les administrateurs.
add_filter('option_page_capability_opem_quote', function () {
    return 'edit_pages';
});

function opem_quote_page(): void
{
    $saved = get_option(OPEM_QUOTE_OPTION, []);
    ?>
    <div class="wrap">
        <h1>Citation du mois</h1>
        <p>Affichée sur la page d’accueil, entre « Nos domaines » et le bandeau IA. Ne pas mettre de guillemets.</p>
        <form method="post" action="options.php">
            <?php settings_fields('opem_quote'); ?>
            <?php foreach (OPEM_QUOTE_LANGS as $lang => $lang_label) : ?>
                <h2><?php echo esc_html($lang_label); ?></h2>
                <table class="form-table" role="presentation">
                    <?php foreach (OPEM_QUOTE_FIELDS as $field => [$label, $max]) :
                        $id    = "opem-quote-$lang-$field";
                        $name  = OPEM_QUOTE_OPTION . "[$lang][$field]";
                        $value = $saved[$lang][$field] ?? '';
                        $dir   = $lang === 'ar' ? 'rtl' : 'ltr';
                        ?>
                        <tr>
                            <th scope="row"><label for="<?php echo esc_attr($id); ?>"><?php echo esc_html($label); ?></label></th>
                            <td>
                                <?php if ($max > 100) : ?>
                                    <textarea id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>" rows="3" class="large-text" maxlength="<?php echo (int) $max; ?>" dir="<?php echo $dir; ?>"><?php echo esc_textarea($value); ?></textarea>
                                <?php else : ?>
                                    <input type="text" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>" class="regular-text" maxlength="<?php echo (int) $max; ?>" dir="<?php echo $dir; ?>">
                                <?php endif; ?>
                                <p class="description"><?php echo (int) $max; ?> caractères au plus.</p>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </table>
            <?php endforeach; ?>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

add_action('rest_api_init', function () {
    register_rest_route('opem/v1', '/quote', [
        'methods'             => WP_REST_Server::READABLE,
        // La citation est déjà publique sur le site : lecture ouverte, aucune donnée sensible.
        'permission_callback' => '__return_true',
        'args'                => [
            'lang' => [
                'type'    => 'string',
                'enum'    => array_keys(OPEM_QUOTE_LANGS),
                'default' => 'fr',
            ],
        ],
        'callback'            => function (WP_REST_Request $request) {
            $saved  = get_option(OPEM_QUOTE_OPTION, []);
            $fields = $saved[$request['lang']] ?? [];
            $data   = [];
            foreach (array_keys(OPEM_QUOTE_FIELDS) as $field) {
                $data[$field] = (string) ($fields[$field] ?? '');
            }
            $response = new WP_REST_Response($data);
            $response->header('Cache-Control', 'public, max-age=300');
            return $response;
        },
    ]);
});
