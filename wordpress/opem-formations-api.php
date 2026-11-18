<?php
/**
 * Plugin Name: OPEM – Formations
 * Description: Menu « Formations » : chaque formation inter-entreprises (textes FR et AR, dates, illustration) a sa page sur le site React, avec le modèle unique des pages formation, et rejoint l'agenda.
 * Version:     1.0.0
 * Requires PHP: 7.4
 *
 * Installation : copier ce fichier et opem-formations-seed.json dans wp-content/mu-plugins/
 * (actif automatiquement). Le fichier .json sert une seule fois : le bouton « Importer les
 * formations du site », en haut de la liste des formations tant qu'elle est vide, y crée les
 * formations déjà en ligne, pour pouvoir les corriger ici.
 *
 * Utilisation : Formations > Ajouter : le titre (français) en haut, puis les champs communs
 * (adresse, référence, dates, places, illustration) et les textes en français et en arabe.
 * « Publier » : la page est en ligne en 5 minutes au plus (cache), et sa session rejoint
 * l'agenda. « Enregistrer le brouillon » : rien n'apparaît sur le site. Un texte arabe vide
 * reprend le texte français. Une formation de même adresse qu'une page du site la remplace.
 *
 * Point d'accès : GET /wp-json/opem/v1/formations?lang=fr|ar (formations publiées).
 */

defined('ABSPATH') || exit;

const OPEM_FORMATIONS_TYPE  = 'opem_formation';
const OPEM_FORMATIONS_META  = '_opem_formation';
const OPEM_FORMATIONS_LANGS = ['fr' => 'Français', 'ar' => 'العربية'];

/** Les illustrations disponibles : celles des pages déjà en ligne (même clé côté site). */
const OPEM_FORMATIONS_THEMES = [
    'diagnostic-d-organisation'    => 'Organisation : bureaux, organigramme et flux de travail',
    'plan-de-formation-2027'       => 'Formation et compétences : plan, calendrier, parcours',
    'cybersecurite-operationnelle' => 'Cybersécurité et numérique : serveurs, bouclier, alertes',
    'iso-9001-2026'                => 'Qualité : ligne de production, portiques de contrôle, produit validé',
];

/** Champs communs aux deux langues : [libellé, type, longueur maximale, aide]. */
const OPEM_FORMATIONS_COMMON = [
    'slug'      => ['Adresse de la page', 'slug', 80, 'Fin de l’adresse : /formation/fiches-formation/… Vide : tirée du titre.'],
    'reference' => ['Référence', 'text', 40, 'Ex. D14-26.INTER.01. V1'],
    'start'     => ['Premier jour', 'date', 10, 'Vide : « Dates : sur demande », et pas de session dans l’agenda.'],
    'end'       => ['Dernier jour', 'date', 10, ''],
    'seats'     => ['Nombre de places', 'number', 3, ''],
    'theme'     => ['Illustration', 'theme', 80, 'Celle d’une page existante, au plus proche du sujet.'],
    'link_href' => ['Lien « Confier… » : adresse', 'text', 300, 'Page du site, ex. /expertises/accompagnement-des-organisations'],
];

/** Textes, en français et en arabe : [libellé, type, longueur maximale, aide]. */
const OPEM_FORMATIONS_TEXTS = [
    'title'         => ['Titre', 'text', 160, ''],
    'promise'       => ['Promesse (sous le titre)', 'text', 200, 'Ex. Protéger, détecter, réagir.'],
    'cycle'         => ['Cycle du catalogue', 'text', 80, 'Ex. Cycle Management'],
    'topic'         => ['Thème dans l’agenda', 'text', 80, 'Ex. Cybersécurité'],
    'duration'      => ['Durée', 'text', 40, 'Ex. 5 jours'],
    'place'         => ['Lieu', 'text', 80, 'Ex. École OPEM'],
    'city'          => ['Ville', 'text', 80, 'Ex. Alger'],
    'format'        => ['Format dans l’agenda', 'text', 120, 'Vide : « Présentiel · ville · durée ».'],
    'hook_question' => ['Accroche : la question', 'textarea', 300, ''],
    'hook_answer'   => ['Accroche : la réponse', 'text', 200, ''],
    'why_text'      => ['Pourquoi cette formation', 'textarea', 1500, ''],
    'why_edge'      => ['Ce qui la distingue', 'textarea', 1000, 'Sans « Ce qui la distingue : », le site l’ajoute.'],
    'link_label'    => ['Lien « Confier… » : texte', 'text', 200, ''],
    'gains'         => ['Vous repartez avec', 'lines', 400, 'Un acquis par ligne (trois de préférence).'],
    'audience'      => ['Pour qui', 'textarea', 600, ''],
    'reasons'       => ['Pourquoi OPEM', 'lines', 300, 'Une raison par ligne (trois de préférence).'],
    'voices'        => ['Témoignages', 'voices', 600, 'Un par ligne : citation | auteur. Vide : pas de section Témoignages.'],
    'alt'           => ['Description de l’illustration', 'textarea', 400, 'Lue aux personnes aveugles. Vide : celle de l’illustration choisie.'],
];

/** Sans ces champs, la formation n'est pas envoyée au site. */
const OPEM_FORMATIONS_REQUIRED = ['title', 'promise', 'why_text'];

add_action('init', function () {
    register_post_type(OPEM_FORMATIONS_TYPE, [
        'labels'          => [
            'name'               => 'Formations',
            'singular_name'      => 'Formation',
            'add_new'            => 'Ajouter',
            'add_new_item'       => 'Ajouter une formation',
            'edit_item'          => 'Modifier la formation',
            'new_item'           => 'Nouvelle formation',
            'search_items'       => 'Rechercher une formation',
            'not_found'          => 'Aucune formation.',
            'not_found_in_trash' => 'Aucune formation dans la corbeille.',
            'all_items'          => 'Toutes les formations',
        ],
        // Les pages sont celles du site React : rien de public côté WordPress.
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'show_in_rest'    => false,
        'menu_position'   => 21,
        'menu_icon'       => 'dashicons-welcome-learn-more',
        'supports'        => ['title'],
        'capability_type' => 'page',
        'map_meta_cap'    => true,
    ]);
});

add_filter('enter_title_here', function ($text, $post) {
    return $post->post_type === OPEM_FORMATIONS_TYPE ? 'Titre de la formation (français)' : $text;
}, 10, 2);

/* ==========================================================================
   Données : lecture, nettoyage
   ========================================================================== */

/** Les données d'une formation, complètes (champs absents : vides). */
function opem_formations_get(int $post_id): array
{
    $saved = get_post_meta($post_id, OPEM_FORMATIONS_META, true);
    $saved = is_array($saved) ? $saved : [];
    $data  = [];
    foreach (OPEM_FORMATIONS_COMMON as $key => $field) {
        $data[$key] = $saved[$key] ?? '';
    }
    foreach (array_keys(OPEM_FORMATIONS_LANGS) as $lang) {
        foreach (OPEM_FORMATIONS_TEXTS as $key => [, $type]) {
            $empty             = in_array($type, ['lines', 'voices'], true) ? [] : '';
            $data[$lang][$key] = $saved[$lang][$key] ?? $empty;
        }
    }
    $data['fr']['title'] = (string) get_post_field('post_title', $post_id);
    return $data;
}

/** Une valeur saisie, nettoyée selon son type (texte brut, longueur bornée). */
function opem_formations_clean($value, string $type, int $max)
{
    if ($type === 'lines' || $type === 'voices') {
        $lines = is_array($value) ? $value : preg_split('/\R/', is_string($value) ? $value : '');
        $clean = [];
        foreach ($lines as $line) {
            if ($type === 'voices') {
                if (is_array($line)) {
                    $quote  = (string) ($line['quote'] ?? '');
                    $author = (string) ($line['author'] ?? '');
                } else {
                    $parts  = explode('|', (string) $line);
                    $author = count($parts) > 1 ? array_pop($parts) : '';
                    $quote  = implode('|', $parts);
                }
                $quote = trim(sanitize_text_field($quote), " \t\"«»“”");
                if ($quote !== '') {
                    $clean[] = ['quote' => mb_substr($quote, 0, $max), 'author' => mb_substr(trim(sanitize_text_field($author)), 0, 120)];
                }
                continue;
            }
            $line = trim(sanitize_text_field((string) $line));
            if ($line !== '') {
                $clean[] = mb_substr($line, 0, $max);
            }
        }
        return array_slice($clean, 0, $type === 'voices' ? 3 : 6);
    }
    $value = is_string($value) || is_numeric($value) ? (string) $value : '';
    switch ($type) {
        case 'slug':
            return mb_substr(sanitize_title($value), 0, $max);
        case 'date':
            return preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) ? $value : '';
        case 'number':
            $number = (int) $value;
            return $number > 0 && $number < 1000 ? $number : '';
        case 'theme':
            return isset(OPEM_FORMATIONS_THEMES[$value]) ? $value : array_key_first(OPEM_FORMATIONS_THEMES);
        case 'textarea':
            return mb_substr(trim(sanitize_textarea_field($value)), 0, $max);
        default:
            return mb_substr(trim(sanitize_text_field($value)), 0, $max);
    }
}

/** Nettoie un ensemble complet (formulaire, import ou, plus tard, lecture d'une fiche). */
function opem_formations_sanitize(array $input): array
{
    $data = [];
    foreach (OPEM_FORMATIONS_COMMON as $key => [, $type, $max]) {
        $data[$key] = opem_formations_clean($input[$key] ?? '', $type, $max);
    }
    if ($data['end'] === '' || ($data['start'] !== '' && $data['end'] < $data['start'])) {
        $data['end'] = $data['start'];
    }
    foreach (array_keys(OPEM_FORMATIONS_LANGS) as $lang) {
        foreach (OPEM_FORMATIONS_TEXTS as $key => [, $type, $max]) {
            $data[$lang][$key] = opem_formations_clean($input[$lang][$key] ?? '', $type, $max);
        }
    }
    return $data;
}

/** Une adresse libre parmi les formations (suffixe -2, -3… si elle est déjà prise). */
function opem_formations_unique_slug(string $slug, int $post_id): string
{
    $slug = $slug !== '' ? $slug : 'formation';
    $base = $slug;
    for ($n = 2; $n < 100; $n++) {
        $taken = get_posts([
            'post_type'      => OPEM_FORMATIONS_TYPE,
            'post_status'    => 'any',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'post__not_in'   => [$post_id],
            'meta_query'     => [['key' => '_opem_formation_slug', 'value' => $slug]],
        ]);
        if (!$taken) {
            return $slug;
        }
        $slug = $base . '-' . $n;
    }
    return $base . '-' . $post_id;
}

/** Enregistre une formation (données déjà nettoyées) ; le titre français est celui de la publication. */
function opem_formations_store(int $post_id, array $data): void
{
    unset($data['fr']['title']);
    $title        = get_post_field('post_title', $post_id);
    $data['slug'] = opem_formations_unique_slug($data['slug'] !== '' ? $data['slug'] : sanitize_title($title), $post_id);
    update_post_meta($post_id, OPEM_FORMATIONS_META, $data);
    update_post_meta($post_id, '_opem_formation_slug', $data['slug']);
    update_post_meta($post_id, '_opem_formation_start', $data['start']);
}

/** Les champs obligatoires encore vides (libellés). */
function opem_formations_missing(array $data): array
{
    $missing = [];
    foreach (OPEM_FORMATIONS_REQUIRED as $key) {
        if (trim((string) $data['fr'][$key]) === '') {
            $missing[] = OPEM_FORMATIONS_TEXTS[$key][0] . ' (français)';
        }
    }
    return $missing;
}

/* ==========================================================================
   Écran de saisie
   ========================================================================== */

add_action('add_meta_boxes_' . OPEM_FORMATIONS_TYPE, function () {
    add_meta_box('opem-formation', 'Contenu de la page', 'opem_formations_box', OPEM_FORMATIONS_TYPE, 'normal', 'high');
});

function opem_formations_field(string $name, string $id, $value, string $type, int $max, string $dir = 'ltr'): void
{
    $attrs = sprintf('id="%s" name="%s" dir="%s"', esc_attr($id), esc_attr($name), esc_attr($dir));
    switch ($type) {
        case 'theme':
            echo '<select ' . $attrs . '>';
            foreach (OPEM_FORMATIONS_THEMES as $key => $label) {
                printf('<option value="%s"%s>%s</option>', esc_attr($key), selected($value, $key, false), esc_html($label));
            }
            echo '</select>';
            return;
        case 'date':
            printf('<input type="date" %s value="%s">', $attrs, esc_attr((string) $value));
            return;
        case 'number':
            printf('<input type="number" min="1" max="999" %s value="%s" class="small-text">', $attrs, esc_attr((string) $value));
            return;
        case 'lines':
        case 'voices':
            $lines = array_map(function ($line) {
                return is_array($line) ? trim($line['quote'] . ($line['author'] !== '' ? ' | ' . $line['author'] : '')) : $line;
            }, is_array($value) ? $value : []);
            printf('<textarea %s rows="4" class="large-text">%s</textarea>', $attrs, esc_textarea(implode("\n", $lines)));
            return;
        case 'textarea':
            printf('<textarea %s rows="4" class="large-text" maxlength="%d">%s</textarea>', $attrs, $max, esc_textarea((string) $value));
            return;
        default:
            printf('<input type="text" %s value="%s" class="large-text" maxlength="%d">', $attrs, esc_attr((string) $value), $max);
    }
}

function opem_formations_box(WP_Post $post): void
{
    $data    = opem_formations_get($post->ID);
    $missing = $post->post_status === 'auto-draft' ? [] : opem_formations_missing($data);
    wp_nonce_field('opem_formation_save', 'opem_formation_nonce');
    if ($missing) {
        printf(
            '<div class="notice notice-warning inline"><p><strong>À compléter avant publication :</strong> %s. Sans ces champs, la page n’apparaît pas sur le site.</p></div>',
            esc_html(implode(', ', $missing))
        );
    }
    if ($data['slug'] !== '' && $post->post_status === 'publish') {
        printf('<p>Page sur le site : <code>/formation/fiches-formation/%s</code></p>', esc_html($data['slug']));
    }
    echo '<h3>Commun aux deux langues</h3><table class="form-table" role="presentation">';
    foreach (OPEM_FORMATIONS_COMMON as $key => [$label, $type, $max, $help]) {
        $id = 'opem-formation-' . $key;
        printf('<tr><th scope="row"><label for="%s">%s</label></th><td>', esc_attr($id), esc_html($label));
        opem_formations_field("opem_formation[$key]", $id, $data[$key], $type, $max);
        if ($help !== '') {
            printf('<p class="description">%s</p>', esc_html($help));
        }
        echo '</td></tr>';
    }
    echo '</table>';
    foreach (OPEM_FORMATIONS_LANGS as $lang => $lang_label) {
        printf('<h3>%s</h3>', esc_html($lang_label));
        if ($lang === 'ar') {
            echo '<p class="description">Un champ arabe vide reprend le texte français.</p>';
        }
        echo '<table class="form-table" role="presentation">';
        foreach (OPEM_FORMATIONS_TEXTS as $key => [$label, $type, $max, $help]) {
            if ($lang === 'fr' && $key === 'title') {
                continue; // le titre français : le champ tout en haut
            }
            $id = "opem-formation-$lang-$key";
            printf('<tr><th scope="row"><label for="%s">%s</label></th><td>', esc_attr($id), esc_html($label));
            opem_formations_field("opem_formation[$lang][$key]", $id, $data[$lang][$key], $type, $max, $lang === 'ar' ? 'rtl' : 'ltr');
            if ($help !== '') {
                printf('<p class="description">%s</p>', esc_html($help));
            }
            echo '</td></tr>';
        }
        echo '</table>';
    }
}

add_action('save_post_' . OPEM_FORMATIONS_TYPE, function (int $post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!isset($_POST['opem_formation_nonce']) || !wp_verify_nonce(sanitize_key($_POST['opem_formation_nonce']), 'opem_formation_save')) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    $input = isset($_POST['opem_formation']) && is_array($_POST['opem_formation']) ? wp_unslash($_POST['opem_formation']) : [];
    opem_formations_store($post_id, opem_formations_sanitize($input));
});

/* Liste des formations : dates, adresse. */
add_filter('manage_' . OPEM_FORMATIONS_TYPE . '_posts_columns', function (array $columns) {
    $date = $columns['date'] ?? null;
    unset($columns['date']);
    $columns['opem_session'] = 'Session';
    $columns['opem_slug']    = 'Adresse';
    if ($date) {
        $columns['date'] = $date;
    }
    return $columns;
});

add_action('manage_' . OPEM_FORMATIONS_TYPE . '_posts_custom_column', function (string $column, int $post_id) {
    $data = opem_formations_get($post_id);
    if ($column === 'opem_session') {
        echo $data['start'] !== ''
            ? esc_html(wp_date('d/m/Y', strtotime($data['start'])) . ' → ' . wp_date('d/m/Y', strtotime($data['end'])))
            : 'Sur demande';
    } elseif ($column === 'opem_slug') {
        echo '<code>' . esc_html($data['slug']) . '</code>';
    }
}, 10, 2);

/* ==========================================================================
   Import des formations déjà en ligne (une fois)
   ========================================================================== */

function opem_formations_seed_file(): string
{
    return __DIR__ . '/opem-formations-seed.json';
}

add_action('admin_notices', function () {
    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'edit-' . OPEM_FORMATIONS_TYPE || !current_user_can('publish_pages')) {
        return;
    }
    if (isset($_GET['opem_imported'])) {
        printf('<div class="notice notice-success"><p>%d formation(s) importée(s).</p></div>', (int) $_GET['opem_imported']);
    }
    $count = wp_count_posts(OPEM_FORMATIONS_TYPE);
    $total = 0;
    foreach ((array) $count as $status => $n) {
        $total += $status === 'auto-draft' ? 0 : (int) $n;
    }
    if ($total > 0 || !is_readable(opem_formations_seed_file())) {
        return;
    }
    ?>
    <div class="notice notice-info">
        <p>Les formations déjà en ligne sur le site ne sont pas encore ici. Importez-les pour pouvoir les corriger dans WordPress.</p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="opem_formations_import">
            <?php wp_nonce_field('opem_formations_import'); ?>
            <p><button class="button button-primary">Importer les formations du site</button></p>
        </form>
    </div>
    <?php
});

add_action('admin_post_opem_formations_import', function () {
    check_admin_referer('opem_formations_import');
    if (!current_user_can('publish_pages')) {
        wp_die('Accès refusé.', 403);
    }
    $seed  = json_decode((string) file_get_contents(opem_formations_seed_file()), true);
    $count = 0;
    foreach (is_array($seed) ? $seed : [] as $entry) {
        if (!is_array($entry) || empty($entry['fr']['title'])) {
            continue;
        }
        $post_id = wp_insert_post([
            'post_type'   => OPEM_FORMATIONS_TYPE,
            'post_status' => 'publish',
            'post_title'  => sanitize_text_field($entry['fr']['title']),
        ]);
        if ($post_id && !is_wp_error($post_id)) {
            opem_formations_store($post_id, opem_formations_sanitize($entry));
            $count++;
        }
    }
    wp_safe_redirect(admin_url('edit.php?post_type=' . OPEM_FORMATIONS_TYPE . '&opem_imported=' . $count));
    exit;
});

/* ==========================================================================
   Lecture par le site React
   ========================================================================== */

/** Une formation, dans la langue demandée (champ arabe vide : le français), pour le site. */
function opem_formations_export(int $post_id, string $lang): ?array
{
    $data = opem_formations_get($post_id);
    if (opem_formations_missing($data)) {
        return null;
    }
    $text = function (string $key) use ($data, $lang) {
        $value = $data[$lang][$key] ?? '';
        $empty = is_array($value) ? !$value : trim((string) $value) === '';
        return $empty ? $data['fr'][$key] : $value;
    };
    $city     = $text('city');
    $duration = $text('duration');
    $format   = $text('format');
    if ($format === '') {
        $format = implode(' · ', array_filter([$lang === 'ar' ? 'حضوري' : 'Présentiel', $city, $duration]));
    }
    return [
        'id'           => $data['slug'],
        'reference'    => $data['reference'],
        'start'        => $data['start'],
        'end'          => $data['end'],
        'seats'        => $data['seats'] === '' ? null : (int) $data['seats'],
        'theme'        => $data['theme'],
        'linkHref'     => $data['link_href'],
        'title'        => $text('title'),
        'promise'      => $text('promise'),
        'cycle'        => $text('cycle'),
        'topic'        => $text('topic'),
        'duration'     => $duration,
        'place'        => $text('place'),
        'city'         => $city,
        'format'       => $format,
        'hookQuestion' => $text('hook_question'),
        'hookAnswer'   => $text('hook_answer'),
        'whyText'      => $text('why_text'),
        'whyEdge'      => $text('why_edge'),
        'linkLabel'    => $text('link_label'),
        'gains'        => $text('gains'),
        'audience'     => $text('audience'),
        'reasons'      => $text('reasons'),
        'voices'       => $text('voices'),
        'alt'          => $text('alt'),
    ];
}

add_action('rest_api_init', function () {
    register_rest_route('opem/v1', '/formations', [
        'methods'             => WP_REST_Server::READABLE,
        // Les formations publiées sont déjà publiques sur le site : lecture ouverte.
        'permission_callback' => '__return_true',
        'args'                => [
            'lang' => [
                'type'    => 'string',
                'enum'    => array_keys(OPEM_FORMATIONS_LANGS),
                'default' => 'fr',
            ],
        ],
        'callback'            => function (WP_REST_Request $request) {
            $ids = get_posts([
                'post_type'      => OPEM_FORMATIONS_TYPE,
                'post_status'    => 'publish',
                'posts_per_page' => 100,
                'fields'         => 'ids',
                'meta_key'       => '_opem_formation_start',
                'orderby'        => 'meta_value',
                'order'          => 'ASC',
            ]);
            $formations = [];
            foreach ($ids as $id) {
                $formation = opem_formations_export((int) $id, $request['lang']);
                if ($formation) {
                    $formations[] = $formation;
                }
            }
            $response = new WP_REST_Response($formations);
            $response->header('Cache-Control', 'public, max-age=300');
            return $response;
        },
    ]);
});
