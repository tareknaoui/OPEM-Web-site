<?php
/**
 * Plugin Name: OPEM – Formulaires (rendez-vous, candidature)
 * Description: Reçoit les deux formulaires du site React, les vérifie et les envoie par courriel à OPEM ; tient la liste de diffusion à part ; range les candidatures et leurs fichiers hors de l’accès public.
 * Version:     1.0.0
 * Requires PHP: 7.4
 *
 * Installation : copier ce fichier et opem-forms-referentiel.php dans wp-content/mu-plugins/
 * (actifs automatiquement). Les tables sont créées à la première visite.
 *
 * Réglages facultatifs, dans wp-config.php (valeur par défaut entre parenthèses) :
 *   OPEM_FORMS_TO_CONTACT   destinataire des demandes de rendez-vous (contact@opem-dz.com)
 *   OPEM_FORMS_TO_EXPERT    destinataire des candidatures (expert@opem-dz.com)
 *   OPEM_FORMS_PRIVATE_DIR  dossier des fichiers reçus, HORS de la racine du site
 *                           (dossier « opem-prive » à côté du dossier de WordPress)
 *   OPEM_FORMS_ORIGINS      adresses du site autorisées à envoyer, séparées par des virgules,
 *                           ex. « https://www.opem-dz.com » (aucune restriction)
 *   OPEM_FORMS_MAIL_MAX_MB  au-delà de ce total, la candidature donne des liens sécurisés au
 *                           lieu de joindre les fichiers (15)
 *   OPEM_FORMS_CLAMSCAN     chemin de clamdscan ou clamscan, si l’hébergeur le propose (aucun)
 *
 * À régler chez l’hébergeur (php.ini) : upload_max_filesize ≥ 10M, post_max_size ≥ 64M,
 * max_file_uploads ≥ 6 ; envoi des courriels par SMTP authentifié (extension SMTP) pour qu’ils
 * n’arrivent pas en indésirables.
 *
 * Points d’accès (multipart/form-data) :
 *   POST /wp-json/opem/v1/rendez-vous   demande de rendez-vous → OPEM_FORMS_TO_CONTACT
 *   POST /wp-json/opem/v1/candidature   candidature, CV et documents → OPEM_FORMS_TO_EXPERT
 *   POST /wp-json/opem/v1/inscription   inscription aux éclairages (page Éclairages) → liste de diffusion
 * Désinscription de la liste de diffusion : https://<wordpress>/?opem_desinscription=<jeton>
 * Administration : Outils > Formulaires OPEM (liste de diffusion, export CSV, état des réglages).
 *
 * Données (loi n° 18-07 modifiée et complétée par la loi n° 25-11) : les demandes ne sont pas
 * gardées ici (courriel seulement ; trois ans dans la messagerie, à la charge d’OPEM) ; les
 * candidatures et leurs fichiers sont effacés cinq ans après le dernier contact ; la liste de
 * diffusion garde la date de l’accord, et la date de désinscription.
 */

defined('ABSPATH') || exit;

foreach (
    [
        'OPEM_FORMS_TO_CONTACT'  => 'contact@opem-dz.com',
        'OPEM_FORMS_TO_EXPERT'   => 'expert@opem-dz.com',
        'OPEM_FORMS_ORIGINS'     => '',
        'OPEM_FORMS_MAIL_MAX_MB' => 15,
        'OPEM_FORMS_CLAMSCAN'    => '',
    ] as $opem_forms_constant => $opem_forms_default
) {
    if (!defined($opem_forms_constant)) {
        define($opem_forms_constant, $opem_forms_default);
    }
}

const OPEM_FORMS_DB_VERSION    = '2'; // 2 : secteurs d’intervention des candidatures
const OPEM_FORMS_RATE_MAX      = 5;   // envois réussis par heure et par adresse IP
const OPEM_FORMS_MIN_MS        = 3000; // un formulaire rempli en moins de 3 s : un robot
const OPEM_FORMS_MESSAGE_MAX   = 1000;
const OPEM_FORMS_CV_MAX        = 5 * 1024 * 1024;
const OPEM_FORMS_DOCUMENT_MAX  = 10 * 1024 * 1024;
const OPEM_FORMS_DOCUMENTS_MAX = 5;
const OPEM_FORMS_KEEP_YEARS    = 5;   // candidatures, après le dernier contact
const OPEM_FORMS_OTHER_DOMAIN  = 'AUTRE';

/** Intitulés français des choix (les clés sont celles envoyées par le site). */
function opem_forms_labels(): array
{
    return [
        'subjects' => [
            'etudes'         => 'Études stratégiques',
            'accompagnement' => 'Accompagnement des organisations',
            'formation'      => 'Formation qualifiante',
            'coaching'       => 'Coaching professionnel',
            'certification'  => 'Certification et accréditation',
            'communication'  => 'Communication institutionnelle',
            'ia'             => 'IA appliquée',
            'autre'          => 'Autre demande',
        ],
        'projects' => [
            'creation'      => 'La création d’une entreprise',
            'developpement' => 'Le développement d’une entreprise',
        ],
        'days'     => [
            'dimanche' => 'Dimanche',
            'lundi'    => 'Lundi',
            'mardi'    => 'Mardi',
            'mercredi' => 'Mercredi',
            'jeudi'    => 'Jeudi',
        ],
        'hours'    => ['9' => '9 h', '10' => '10 h', '11' => '11 h', '14' => '14 h', '15' => '15 h', '16' => '16 h'],
        'roles'    => [
            'consultant'           => 'Consultant',
            'formateur'            => 'Formateur',
            'consultant-formateur' => 'Consultant et formateur',
        ],
    ];
}

/* ==========================================================================
   Tables : la liste de diffusion (à part des demandes) et les candidatures
   ========================================================================== */

add_action('init', 'opem_forms_install');

function opem_forms_install(): void
{
    if (get_option('opem_forms_db_version') === OPEM_FORMS_DB_VERSION) {
        return;
    }
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $charset = $wpdb->get_charset_collate();

    dbDelta("CREATE TABLE {$wpdb->prefix}opem_newsletter (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  email varchar(254) NOT NULL,
  name varchar(120) NOT NULL DEFAULT '',
  lang varchar(5) NOT NULL DEFAULT 'fr',
  source varchar(40) NOT NULL DEFAULT '',
  consented_at datetime NOT NULL,
  unsubscribed_at datetime DEFAULT NULL,
  token char(32) NOT NULL,
  PRIMARY KEY  (id),
  UNIQUE KEY email (email),
  UNIQUE KEY token (token)
) $charset;");

    dbDelta("CREATE TABLE {$wpdb->prefix}opem_candidatures (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  created_at datetime NOT NULL,
  last_contact_at datetime NOT NULL,
  name varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  phone varchar(32) NOT NULL,
  role varchar(30) NOT NULL,
  domains longtext NOT NULL,
  specialities longtext NOT NULL,
  others longtext NOT NULL,
  sectors longtext NOT NULL,
  files longtext NOT NULL,
  lang varchar(5) NOT NULL DEFAULT 'fr',
  PRIMARY KEY  (id),
  KEY email (email),
  KEY last_contact_at (last_contact_at)
) $charset;");

    update_option('opem_forms_db_version', OPEM_FORMS_DB_VERSION);
}

/* ==========================================================================
   Points d'accès
   ========================================================================== */

add_action('rest_api_init', function () {
    register_rest_route('opem/v1', '/rendez-vous', [
        'methods'             => WP_REST_Server::CREATABLE,
        // Formulaire public : les contrôles (robots, fréquence, origine) sont dans le traitement.
        'permission_callback' => '__return_true',
        'callback'            => 'opem_forms_appointment',
    ]);
    register_rest_route('opem/v1', '/candidature', [
        'methods'             => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback'            => 'opem_forms_application',
    ]);
    register_rest_route('opem/v1', '/inscription', [
        'methods'             => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback'            => 'opem_forms_newsletter',
    ]);
});

/**
 * Contrôles communs, avant de lire le formulaire. Renvoie une réponse à rendre telle quelle,
 * ou null pour continuer. Un robot (champ piège rempli, envoi trop rapide) reçoit une fausse
 * réussite : rien n'est envoyé, et il n'apprend rien.
 */
function opem_forms_guard(WP_REST_Request $request): ?WP_REST_Response
{
    $origins = array_filter(array_map(function ($origin) {
        return rtrim(trim($origin), '/');
    }, explode(',', (string) OPEM_FORMS_ORIGINS)));
    $origin = rtrim((string) $request->get_header('origin'), '/');
    if ($origins && !in_array($origin, $origins, true)) {
        return new WP_REST_Response(['code' => 'origin'], 403);
    }

    // Envoi plus lourd que post_max_size : PHP a tout écarté, formulaire compris.
    $length = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    $limit  = wp_convert_hr_to_bytes((string) ini_get('post_max_size'));
    if ($limit > 0 && $length > $limit) {
        return new WP_REST_Response(['code' => 'too_large'], 413);
    }

    $trap    = $request->get_param('website');
    $elapsed = (int) $request->get_param('elapsed');
    if ((is_string($trap) && trim($trap) !== '') || $elapsed < OPEM_FORMS_MIN_MS) {
        return new WP_REST_Response(['ok' => true], 200);
    }

    if ((int) get_transient(opem_forms_rate_key()) >= OPEM_FORMS_RATE_MAX) {
        return new WP_REST_Response(['code' => 'rate'], 429);
    }
    return null;
}

function opem_forms_rate_key(): string
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    return 'opem_forms_' . md5($ip . wp_salt('nonce'));
}

/** Un envoi réussi de plus pour cette adresse IP, pendant une heure. */
function opem_forms_rate_hit(): void
{
    $key = opem_forms_rate_key();
    set_transient($key, (int) get_transient($key) + 1, HOUR_IN_SECONDS);
}

/* ---------- Lecture des champs ---------- */

function opem_forms_text(WP_REST_Request $request, string $key, int $max): string
{
    $value = $request->get_param($key);
    return is_string($value) ? mb_substr(trim(sanitize_text_field($value)), 0, $max) : '';
}

function opem_forms_choice(WP_REST_Request $request, string $key, array $allowed): string
{
    $value = $request->get_param($key);
    return is_string($value) && isset($allowed[$value]) ? $value : '';
}

function opem_forms_checked(WP_REST_Request $request, string $key): bool
{
    return $request->get_param($key) === '1';
}

function opem_forms_email(WP_REST_Request $request, array &$errors): string
{
    $email = strtolower(opem_forms_text($request, 'email', 254));
    if ($email === '') {
        $errors['email'] = 'required';
    } elseif (!is_email($email)) {
        $errors['email'] = 'email';
        $email = '';
    }
    return $email;
}

/** « +213 551234567 » : l'indicatif choisi, puis le numéro sans séparateurs ni zéro initial. */
function opem_forms_phone(WP_REST_Request $request, array &$errors): string
{
    $raw    = opem_forms_text($request, 'phone', 24);
    $code   = opem_forms_text($request, 'phoneCode', 6);
    $number = ltrim((string) preg_replace('/[\s.\-()\/]/', '', $raw), '0');
    if ($raw === '') {
        $errors['phone'] = 'required';
        return '';
    }
    if (!preg_match('/^\+\d{1,4}$/', $code) || !preg_match('/^\d{6,14}$/', $number)) {
        $errors['phone'] = 'phone';
        return '';
    }
    return $code . ' ' . $number;
}

function opem_forms_lang(WP_REST_Request $request): string
{
    return $request->get_param('lang') === 'ar' ? 'ar' : 'fr';
}

function opem_forms_now_text(): string
{
    return wp_date('d/m/Y') . ' à ' . wp_date('H:i');
}

/** Courriel en texte brut, réponse directe à la personne (Reply-To). */
function opem_forms_mail(string $to, string $subject, array $lines, string $name, string $email, array $attachments = []): bool
{
    $name    = str_replace(["\r", "\n", '"', '<', '>'], '', $name);
    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        sprintf('Reply-To: "%s" <%s>', $name, $email),
    ];
    return wp_mail($to, $subject, implode("\n", $lines), $headers, $attachments);
}

function opem_forms_invalid(array $errors): WP_REST_Response
{
    return new WP_REST_Response(['code' => 'invalid', 'errors' => $errors], 422);
}

/* ==========================================================================
   Formulaire 1 : demande de rendez-vous
   ========================================================================== */

function opem_forms_appointment(WP_REST_Request $request): WP_REST_Response
{
    $guard = opem_forms_guard($request);
    if ($guard) {
        return $guard;
    }
    $labels = opem_forms_labels();
    $errors = [];

    $name = opem_forms_text($request, 'name', 120);
    if ($name === '') {
        $errors['name'] = 'required';
    }
    $organisation = opem_forms_text($request, 'organisation', 120);
    $email        = opem_forms_email($request, $errors);
    $phone        = opem_forms_phone($request, $errors);

    $subject = opem_forms_choice($request, 'subject', $labels['subjects']);
    if ($subject === '') {
        $errors['subject'] = 'required';
    }
    $subjectOther = $subject === 'autre' ? opem_forms_text($request, 'subjectOther', 200) : '';
    if ($subject === 'autre' && $subjectOther === '') {
        $errors['subjectOther'] = 'required';
    }
    $project = opem_forms_choice($request, 'project', $labels['projects']);

    $message = $request->get_param('message');
    $message = is_string($message) ? trim(sanitize_textarea_field($message)) : '';
    if ($message === '') {
        $errors['message'] = 'required';
    } elseif (mb_strlen($message) > OPEM_FORMS_MESSAGE_MAX) {
        $errors['message'] = 'too_long';
    }

    $slots = [];
    foreach ([1, 2] as $n) {
        $day  = opem_forms_choice($request, "slot{$n}Day", $labels['days']);
        $hour = opem_forms_choice($request, "slot{$n}Hour", $labels['hours']);
        if ($day !== '' && $hour === '') {
            $errors["slot{$n}Hour"] = 'slot_hour';
        } elseif ($hour !== '' && $day === '') {
            $errors["slot{$n}Day"] = 'slot_day';
        } elseif ($day !== '') {
            $slots[$n] = $labels['days'][$day] . ' à ' . $labels['hours'][$hour];
        }
    }

    if (!opem_forms_checked($request, 'consent')) {
        $errors['consent'] = 'required';
    }
    $newsletter = opem_forms_checked($request, 'newsletter');
    if ($errors) {
        return opem_forms_invalid($errors);
    }
    $lang = opem_forms_lang($request);
    $now  = opem_forms_now_text();

    // Les créneaux choisis en tête du message.
    $lines = ['CRÉNEAUX PROPOSÉS POUR UN ENTRETIEN TÉLÉPHONIQUE'];
    if ($slots) {
        foreach ([1, 2] as $n) {
            $lines[] = "Option $n : " . ($slots[$n] ?? '—');
        }
    } else {
        $lines[] = 'Aucun créneau proposé : convenir d’un premier échange.';
    }
    array_push(
        $lines,
        '',
        '——————————————————————————————',
        '',
        'Nom et prénom : ' . $name,
        'Organisation : ' . ($organisation !== '' ? $organisation : '— (projet à titre personnel)'),
        'Courriel : ' . $email,
        'Téléphone : ' . $phone,
        'Objet de votre demande : ' . ($subject === 'autre' ? 'Autre demande : ' . $subjectOther : $labels['subjects'][$subject]),
        'Votre projet concerne : ' . ($project !== '' ? $labels['projects'][$project] : '— (sans réponse)'),
        '',
        'Votre message :',
        $message,
        '',
        '——————————————————————————————',
        'Consentement : donné le ' . $now,
        'Rester informé : ' . ($newsletter ? 'oui, inscrit à la liste de diffusion le ' . $now : 'non'),
        'Langue du site : ' . ($lang === 'ar' ? 'arabe' : 'français')
    );

    $title = 'Demande de rendez-vous : ' . $name . ($organisation !== '' ? ' (' . $organisation . ')' : '');
    if (!opem_forms_mail(OPEM_FORMS_TO_CONTACT, $title, $lines, $name, $email)) {
        error_log('OPEM formulaires : échec de l’envoi de la demande de rendez-vous.');
        return new WP_REST_Response(['code' => 'mail'], 502);
    }
    if ($newsletter) {
        opem_forms_subscribe($email, $name, $lang, 'rendez-vous');
    }
    opem_forms_rate_hit();
    return new WP_REST_Response(['ok' => true], 200);
}

/* ==========================================================================
   Liste de diffusion : à part des demandes, avec la date de l'accord
   ========================================================================== */

function opem_forms_subscribe(string $email, string $name, string $lang, string $source): void
{
    global $wpdb;
    $table    = $wpdb->prefix . 'opem_newsletter';
    $now      = current_time('mysql');
    $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE email = %s", $email));
    if ($existing) {
        $fields = ['lang' => $lang, 'source' => $source, 'consented_at' => $now, 'unsubscribed_at' => null];
        if ($name !== '') {
            $fields['name'] = $name; // une inscription sans nom (page Éclairages) garde le nom connu
        }
        $wpdb->update($table, $fields, ['id' => (int) $existing]);
        return;
    }
    $wpdb->insert($table, [
        'email'        => $email,
        'name'         => $name,
        'lang'         => $lang,
        'source'       => $source,
        'consented_at' => $now,
        'token'        => bin2hex(random_bytes(16)),
    ]);
}

/** Inscription seule (page Éclairages) : l'adresse et l'accord, rien d'autre. */
function opem_forms_newsletter(WP_REST_Request $request): WP_REST_Response
{
    $guard = opem_forms_guard($request);
    if ($guard) {
        return $guard;
    }
    $errors = [];
    $email  = opem_forms_email($request, $errors);
    if (!opem_forms_checked($request, 'consent')) {
        $errors['consent'] = 'required';
    }
    if ($errors) {
        return opem_forms_invalid($errors);
    }
    opem_forms_subscribe($email, '', opem_forms_lang($request), 'eclairages');
    opem_forms_rate_hit();
    return new WP_REST_Response(['ok' => true], 200);
}

function opem_forms_unsubscribe_url(string $token): string
{
    return add_query_arg('opem_desinscription', $token, home_url('/'));
}

/**
 * Lien de désinscription : la page demande une confirmation (un bouton), pour que les
 * logiciels qui ouvrent les liens des courriels ne désinscrivent personne à sa place.
 */
add_action('init', function () {
    if (!isset($_GET['opem_desinscription'])) {
        return;
    }
    $token = preg_replace('/[^a-f0-9]/', '', strtolower((string) wp_unslash($_GET['opem_desinscription'])));
    $done  = false;
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && strlen($token) === 32) {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "UPDATE {$wpdb->prefix}opem_newsletter SET unsubscribed_at = %s WHERE token = %s AND unsubscribed_at IS NULL",
            current_time('mysql'),
            $token
        ));
        $done = true; // même réponse que le jeton existe ou non
    }
    nocache_headers();
    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex');
    $action = esc_url(opem_forms_unsubscribe_url($token));
    echo '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Désinscription · OPEM</title></head>';
    echo '<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:12vh auto;padding:0 1.25rem;color:#1f2933;line-height:1.6">';
    if ($done) {
        echo '<h1 style="color:#11365b">Désinscription enregistrée</h1>';
        echo '<p>Vous ne recevrez plus les éclairages d’OPEM ni l’annonce de ses formations et offres.</p>';
        echo '<p dir="rtl" lang="ar">تم تسجيل إلغاء اشتراككم. لن تتلقوا بعد الآن إضاءات OPEM ولا الإعلان عن تكويناتها وعروضها.</p>';
    } else {
        echo '<h1 style="color:#11365b">Se désinscrire</h1>';
        echo '<p>Vous ne recevrez plus les éclairages d’OPEM ni l’annonce de ses formations et offres.</p>';
        echo '<p dir="rtl" lang="ar">لن تتلقوا بعد الآن إضاءات OPEM ولا الإعلان عن تكويناتها وعروضها.</p>';
        echo '<form method="post" action="' . $action . '"><button type="submit" style="font:inherit;font-weight:600;padding:.75rem 1.5rem;border:0;border-radius:4px;background:#004d91;color:#fff;cursor:pointer">Confirmer la désinscription · تأكيد إلغاء الاشتراك</button></form>';
    }
    echo '</body></html>';
    exit;
});

/* ==========================================================================
   Formulaire 2 : candidature au réseau d'experts
   ========================================================================== */

function opem_forms_application(WP_REST_Request $request): WP_REST_Response
{
    $guard = opem_forms_guard($request);
    if ($guard) {
        return $guard;
    }
    $labels = opem_forms_labels();
    $ref    = function_exists('opem_forms_referentiel') ? opem_forms_referentiel() : [];
    $errors = [];

    $name = opem_forms_text($request, 'name', 120);
    if ($name === '') {
        $errors['name'] = 'required';
    }
    $email = opem_forms_email($request, $errors);
    $phone = opem_forms_phone($request, $errors);
    $role  = opem_forms_choice($request, 'role', $labels['roles']);
    if ($role === '') {
        $errors['role'] = 'required';
    }

    // 05 Domaines : ceux du référentiel, et « Autre domaine » avec son intitulé libre.
    $domains = array_values(array_unique(array_filter((array) $request->get_param('domains'), function ($domain) use ($ref) {
        return is_string($domain) && (isset($ref[$domain]) || $domain === OPEM_FORMS_OTHER_DOMAIN);
    })));
    if (!$domains) {
        $errors['domains'] = 'required';
    }
    $hasOther    = in_array(OPEM_FORMS_OTHER_DOMAIN, $domains, true);
    $domainOther = $hasOther ? opem_forms_text($request, 'domainOther', 200) : '';
    if ($hasOther && $domainOther === '') {
        $errors['domainOther'] = 'required';
    }

    // 06 Spécialités : seulement celles des domaines cochés ; on garde l'identifiant SPE.
    $raw    = array_filter((array) $request->get_param('specialities'), 'is_string');
    $picked = [];
    foreach ($domains as $domain) {
        foreach ($ref[$domain]['specialities'] ?? [] as $id => $label) {
            if (in_array($id, $raw, true)) {
                $picked[] = ['id' => $id, 'label' => $label, 'domain' => $domain];
            }
        }
    }
    $otherRaw = $request->get_param('specialityOther');
    $others   = [];
    foreach (is_array($otherRaw) ? $otherRaw : [] as $domain => $text) {
        if (!is_string($domain) || !in_array($domain, $domains, true) || !is_string($text)) {
            continue;
        }
        $text = mb_substr(trim(sanitize_text_field($text)), 0, 200);
        if ($text === '') {
            $errors["specialityOther-$domain"] = 'required';
        } else {
            $others[$domain] = $text;
        }
    }
    if ($hasOther && !isset($others[OPEM_FORMS_OTHER_DOMAIN])) {
        $errors['specialityOther-' . OPEM_FORMS_OTHER_DOMAIN] = 'required';
    }
    if ($domains && !$picked && !$others) {
        $errors['specialities'] = 'required';
    }

    // Secteurs d'intervention (facultatif) : seulement ceux de la liste ; on garde l'identifiant SEC.
    $sectorRef = function_exists('opem_forms_secteurs') ? opem_forms_secteurs() : [];
    $sectorRaw = array_filter((array) $request->get_param('sectors'), 'is_string');
    $sectors   = [];
    foreach ($sectorRef as $category) {
        foreach ($category['sectors'] as $id => $label) {
            if (in_array($id, $sectorRaw, true)) {
                $sectors[] = ['id' => $id, 'label' => $label, 'category' => $category['label']];
            }
        }
    }

    // 07 CV et 08 autres documents.
    $files     = $request->get_file_params();
    $cv        = opem_forms_uploads($files, 'cv');
    $documents = opem_forms_uploads($files, 'documents');
    if (!$cv) {
        $errors['cv'] = 'required';
    } else {
        $problem = opem_forms_check_file($cv[0], ['pdf', 'doc', 'docx'], OPEM_FORMS_CV_MAX);
        if ($problem !== '') {
            $errors['cv'] = $problem;
        }
    }
    if (count($documents) > OPEM_FORMS_DOCUMENTS_MAX) {
        $errors['documents'] = 'count';
    } else {
        foreach ($documents as $document) {
            $problem = opem_forms_check_file($document, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'], OPEM_FORMS_DOCUMENT_MAX);
            if ($problem !== '') {
                $errors['documents'] = $problem;
                break;
            }
        }
    }

    if (!opem_forms_checked($request, 'consent')) {
        $errors['consent'] = 'required';
    }
    if (!opem_forms_checked($request, 'presentation')) {
        $errors['presentation'] = 'required';
    }
    if ($errors) {
        return opem_forms_invalid($errors);
    }

    // Les fichiers, hors de l'accès public, sous un nom tiré au hasard.
    $root = opem_forms_private_root();
    if ($root === '') {
        error_log('OPEM formulaires : dossier privé indisponible (régler OPEM_FORMS_PRIVATE_DIR).');
        return new WP_REST_Response(['code' => 'storage'], 500);
    }
    $stored = [];
    $uploads = [['cv', $cv[0]]];
    foreach ($documents as $document) {
        $uploads[] = ['documents', $document];
    }
    foreach ($uploads as [$field, $file]) {
        $saved = opem_forms_store($root, $file);
        if (!$saved) {
            opem_forms_delete_files($root, $stored);
            return new WP_REST_Response(['code' => 'storage'], 500);
        }
        $stored[] = ['field' => $field] + $saved;
    }

    global $wpdb;
    $table = $wpdb->prefix . 'opem_candidatures';
    $now   = current_time('mysql');
    $lang  = opem_forms_lang($request);
    $wpdb->insert($table, [
        'created_at'      => $now,
        'last_contact_at' => $now,
        'name'            => $name,
        'email'           => $email,
        'phone'           => $phone,
        'role'            => $role,
        'domains'         => wp_json_encode(['ids' => $domains, 'other' => $domainOther]),
        'specialities'    => wp_json_encode($picked),
        'others'          => wp_json_encode($others),
        'sectors'         => wp_json_encode($sectors),
        'files'           => wp_json_encode($stored),
        'lang'            => $lang,
    ]);
    $id = (int) $wpdb->insert_id;
    // Une nouvelle candidature est un nouveau contact : le délai de conservation repart.
    $wpdb->query($wpdb->prepare("UPDATE $table SET last_contact_at = %s WHERE email = %s", $now, $email));

    // Le message à OPEM : toutes les réponses, lisibles.
    $date  = opem_forms_now_text();
    $lines = [
        'Nouvelle candidature au réseau d’experts' . ($id ? " (n° $id)" : ''),
        '',
        'Nom et prénom : ' . $name,
        'Courriel : ' . $email,
        'Téléphone : ' . $phone,
        'Vous intervenez comme : ' . $labels['roles'][$role],
        '',
        'Domaines d’expertise :',
    ];
    foreach ($domains as $domain) {
        $lines[] = '- ' . ($domain === OPEM_FORMS_OTHER_DOMAIN ? 'Autre domaine : ' . $domainOther : $ref[$domain]['label']);
    }
    $lines[] = '';
    $lines[] = 'Vos spécialités :';
    foreach ($domains as $domain) {
        $title = $domain === OPEM_FORMS_OTHER_DOMAIN ? 'Autre domaine (' . $domainOther . ')' : $ref[$domain]['label'];
        $items = [];
        foreach ($picked as $speciality) {
            if ($speciality['domain'] === $domain) {
                $items[] = '  - ' . $speciality['label'] . ' (' . $speciality['id'] . ')';
            }
        }
        if (isset($others[$domain])) {
            $items[] = '  - Autre : ' . $others[$domain];
        }
        if ($items) {
            $lines[] = $title;
            array_push($lines, ...$items);
        }
    }

    $lines[] = '';
    $lines[] = 'Secteurs d’intervention :';
    if (!$sectors) {
        $lines[] = '- Non renseignés';
    }
    $category = null;
    foreach ($sectors as $sector) {
        if ($sector['category'] !== $category) {
            $category = $sector['category'];
            $lines[]  = $category;
        }
        $lines[] = '  - ' . $sector['label'] . ' (' . $sector['id'] . ')';
    }

    // Pièces jointes si le total le permet ; sinon, des liens réservés aux administrateurs.
    $total = array_sum(array_column($stored, 'size'));
    $attach = $total <= (int) OPEM_FORMS_MAIL_MAX_MB * 1024 * 1024;
    $attachments = [];
    $lines[] = '';
    $lines[] = $attach
        ? 'Fichiers (joints à ce message) :'
        : 'Fichiers (trop lourds pour être joints ; liens sécurisés, connexion à WordPress requise) :';
    foreach ($stored as $file) {
        $label   = ($file['field'] === 'cv' ? 'Curriculum vitæ' : 'Autre document') . ' : ' . $file['original'] . ' (' . size_format($file['size'], 1) . ')';
        $lines[] = '- ' . $label;
        if ($attach) {
            $attachments[($file['field'] === 'cv' ? 'CV - ' : '') . $file['original']] = $root . '/' . $file['path'];
        } else {
            $lines[] = '  ' . opem_forms_file_url($id, $file['path']);
        }
    }
    array_push(
        $lines,
        '',
        'Consentement : donné le ' . $date,
        'Présentation aux clients : acceptée le ' . $date,
        'Langue du site : ' . ($lang === 'ar' ? 'arabe' : 'français'),
        '',
        'Les fichiers sont conservés hors de l’accès public du site et effacés, avec la candidature, cinq ans après le dernier contact.'
    );

    $sent = opem_forms_mail(OPEM_FORMS_TO_EXPERT, 'Candidature au réseau d’experts : ' . $name, $lines, $name, $email, $attachments);
    if (!$sent) {
        // La candidature est enregistrée : elle n'est pas perdue, mais le courriel n'est pas parti.
        error_log("OPEM formulaires : échec de l’envoi du courriel de la candidature n° $id.");
    }
    opem_forms_rate_hit();
    return new WP_REST_Response(['ok' => true], 200);
}

/* ---------- Fichiers reçus ---------- */

/** Les fichiers d'un champ, à plat (un seul fichier ou plusieurs, champ « documents[] »). */
function opem_forms_uploads(array $files, string $key): array
{
    if (empty($files[$key]) || !is_array($files[$key])) {
        return [];
    }
    $field = $files[$key];
    if (!is_array($field['name'])) {
        return $field['error'] === UPLOAD_ERR_NO_FILE ? [] : [$field];
    }
    $list = [];
    foreach (array_keys($field['name']) as $i) {
        if ($field['error'][$i] === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        $list[] = [
            'name'     => $field['name'][$i],
            'tmp_name' => $field['tmp_name'][$i],
            'error'    => $field['error'][$i],
            'size'     => $field['size'][$i],
        ];
    }
    return $list;
}

/** '' si le fichier convient ; sinon 'format' ou 'size' (les codes affichés par le site). */
function opem_forms_check_file(array $file, array $extensions, int $max): string
{
    if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
        return 'size';
    }
    if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
        return 'format';
    }
    // Extension, en refusant d'office les fichiers à macros (.docm, .xlsm…) : absents de la liste.
    $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $extensions, true)) {
        return 'format';
    }
    $size = (int) filesize($file['tmp_name']);
    if ($size <= 0 || $size > $max) {
        return 'size';
    }
    // Le type réel, lu dans le fichier, et pas seulement son extension.
    if (!opem_forms_real_type($file['tmp_name'], $extension)) {
        return 'format';
    }
    if (!opem_forms_scan($file['tmp_name'])) {
        return 'format';
    }
    return '';
}

function opem_forms_real_type(string $path, string $extension): bool
{
    $head = (string) file_get_contents($path, false, null, 0, 8);
    switch ($extension) {
        case 'pdf':
            return strncmp($head, '%PDF-', 5) === 0;
        case 'jpg':
        case 'jpeg':
            return strncmp($head, "\xFF\xD8\xFF", 3) === 0;
        case 'png':
            return $head === "\x89PNG\r\n\x1A\n";
        case 'doc':
        case 'xls':
            return $head === "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1"; // ancien format Office
        case 'docx':
            return opem_forms_ooxml($path, 'word/document.xml', 'word/vbaProject.bin');
        case 'xlsx':
            return opem_forms_ooxml($path, 'xl/workbook.xml', 'xl/vbaProject.bin');
    }
    return false;
}

/** Un document Office récent : une archive avec son contenu attendu, et sans macros. */
function opem_forms_ooxml(string $path, string $required, string $macros): bool
{
    if (strncmp((string) file_get_contents($path, false, null, 0, 4), "PK\x03\x04", 4) !== 0) {
        return false;
    }
    if (!class_exists('ZipArchive')) {
        return true; // signature vérifiée ; contenu non lisible sans l'extension zip de PHP
    }
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        return false;
    }
    $types = $zip->getFromName('[Content_Types].xml');
    $ok    = is_string($types)
        && $zip->locateName($required) !== false
        && $zip->locateName($macros) === false
        && stripos($types, 'macroEnabled') === false;
    $zip->close();
    return $ok;
}

/** Analyse antivirus, si l'hébergeur fournit ClamAV (réglage OPEM_FORMS_CLAMSCAN) ou un filtre. */
function opem_forms_scan(string $path): bool
{
    $clean = true;
    if (OPEM_FORMS_CLAMSCAN !== '' && function_exists('exec')) {
        $output = [];
        $status = 0;
        exec(escapeshellcmd((string) OPEM_FORMS_CLAMSCAN) . ' --no-summary ' . escapeshellarg($path) . ' 2>&1', $output, $status);
        if ($status === 1) {
            $clean = false; // virus trouvé
        } elseif ($status !== 0) {
            error_log('OPEM formulaires : analyse antivirus impossible : ' . implode(' ', $output));
        }
    }
    return (bool) apply_filters('opem_forms_scan_file', $clean, $path);
}

/** Le dossier privé (créé au besoin, protégé s'il se trouvait malgré tout sous la racine web). */
function opem_forms_private_root(): string
{
    $root = defined('OPEM_FORMS_PRIVATE_DIR')
        ? (string) OPEM_FORMS_PRIVATE_DIR
        : dirname(untrailingslashit(ABSPATH)) . '/opem-prive';
    $root = untrailingslashit($root);
    if (!is_dir($root) && !wp_mkdir_p($root)) {
        return '';
    }
    if (!file_exists($root . '/.htaccess')) {
        @file_put_contents($root . '/.htaccess', "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    }
    if (!file_exists($root . '/index.php')) {
        @file_put_contents($root . '/index.php', "<?php\n// Silence.\n");
    }
    return is_writable($root) ? $root : '';
}

/** Range un fichier reçu sous un nom aléatoire ; renvoie sa fiche, ou null en cas d'échec. */
function opem_forms_store(string $root, array $file): ?array
{
    $folder = gmdate('Y/m');
    if (!is_dir("$root/$folder") && !wp_mkdir_p("$root/$folder")) {
        return null;
    }
    $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    $path      = $folder . '/' . bin2hex(random_bytes(16)) . '.' . $extension;
    if (!move_uploaded_file($file['tmp_name'], "$root/$path")) {
        return null;
    }
    @chmod("$root/$path", 0640);
    $original = sanitize_file_name((string) $file['name']);
    return [
        'path'     => $path,
        'original' => $original !== '' ? $original : basename($path),
        'size'     => (int) filesize("$root/$path"),
    ];
}

function opem_forms_delete_files(string $root, array $files): void
{
    foreach ($files as $file) {
        if (!empty($file['path']) && preg_match('#^\d{4}/\d{2}/[a-f0-9]{32}\.[a-z]{3,4}$#', $file['path'])) {
            @unlink("$root/{$file['path']}");
        }
    }
}

/** Lien de téléchargement d'un fichier, réservé aux administrateurs connectés. */
function opem_forms_file_url(int $id, string $path): string
{
    return add_query_arg(['action' => 'opem_fichier', 'id' => $id, 'f' => $path], admin_url('admin-post.php'));
}

add_action('admin_post_opem_fichier', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Accès réservé aux administrateurs.', 'OPEM', ['response' => 403]);
    }
    $id   = isset($_GET['id']) ? absint($_GET['id']) : 0;
    $path = isset($_GET['f']) ? (string) wp_unslash($_GET['f']) : '';
    global $wpdb;
    $json  = $wpdb->get_var($wpdb->prepare("SELECT files FROM {$wpdb->prefix}opem_candidatures WHERE id = %d", $id));
    $files = is_string($json) ? json_decode($json, true) : [];
    $root  = opem_forms_private_root();
    foreach (is_array($files) ? $files : [] as $file) {
        if (($file['path'] ?? '') === $path && $root !== '' && is_file("$root/$path")) {
            nocache_headers();
            header('Content-Type: application/octet-stream');
            header('X-Content-Type-Options: nosniff');
            header('Content-Length: ' . filesize("$root/$path"));
            header("Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode((string) $file['original']));
            readfile("$root/$path");
            exit;
        }
    }
    wp_die('Fichier introuvable (peut-être effacé au terme de sa durée de conservation).', 'OPEM', ['response' => 404]);
});

/* ==========================================================================
   Durées de conservation : un passage par jour
   ========================================================================== */

add_action('init', function () {
    if (!wp_next_scheduled('opem_forms_purge')) {
        wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', 'opem_forms_purge');
    }
});

add_action('opem_forms_purge', function () {
    global $wpdb;
    $table = $wpdb->prefix . 'opem_candidatures';
    $limit = wp_date('Y-m-d H:i:s', strtotime('-' . OPEM_FORMS_KEEP_YEARS . ' years'));
    $root  = opem_forms_private_root();
    $rows  = $wpdb->get_results($wpdb->prepare("SELECT id, files FROM $table WHERE last_contact_at < %s", $limit));
    foreach ($rows as $row) {
        $files = json_decode((string) $row->files, true);
        if ($root !== '' && is_array($files)) {
            opem_forms_delete_files($root, $files);
        }
        $wpdb->delete($table, ['id' => (int) $row->id]);
    }
});

/* ==========================================================================
   Administration : Outils > Formulaires OPEM
   ========================================================================== */

add_action('admin_menu', function () {
    add_management_page('Formulaires OPEM', 'Formulaires OPEM', 'manage_options', 'opem-formulaires', 'opem_forms_admin_page');
});

function opem_forms_admin_page(): void
{
    global $wpdb;
    $table       = $wpdb->prefix . 'opem_newsletter';
    $subscribers = $wpdb->get_results("SELECT email, name, lang, source, consented_at FROM $table WHERE unsubscribed_at IS NULL ORDER BY consented_at DESC LIMIT 200");
    $active      = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE unsubscribed_at IS NULL");
    $left        = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE unsubscribed_at IS NOT NULL");
    $candidates  = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}opem_candidatures");
    $root        = opem_forms_private_root();
    $export      = wp_nonce_url(admin_url('admin-post.php?action=opem_newsletter_csv'), 'opem_newsletter_csv');

    echo '<div class="wrap"><h1>Formulaires OPEM</h1>';
    echo '<h2>Liste de diffusion « Rester informé »</h2>';
    printf('<p>%d personne(s) inscrite(s), %d désinscrite(s). Chaque envoi doit comporter le lien de désinscription de la personne (colonne de l’export).</p>', $active, $left);
    printf('<p><a class="button button-primary" href="%s">Exporter la liste (CSV)</a></p>', esc_url($export));
    echo '<table class="widefat striped"><thead><tr><th>Courriel</th><th>Nom</th><th>Langue</th><th>Formulaire</th><th>Date de l’accord</th></tr></thead><tbody>';
    foreach ($subscribers as $row) {
        printf(
            '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
            esc_html($row->email),
            esc_html($row->name),
            esc_html($row->lang),
            esc_html($row->source),
            esc_html(mysql2date('d/m/Y H:i', $row->consented_at))
        );
    }
    if (!$subscribers) {
        echo '<tr><td colspan="5">Personne pour l’instant.</td></tr>';
    }
    echo '</tbody></table>';

    echo '<h2>État des réglages</h2><table class="widefat striped"><tbody>';
    $status = [
        'Demandes de rendez-vous envoyées à'  => OPEM_FORMS_TO_CONTACT,
        'Candidatures envoyées à'             => OPEM_FORMS_TO_EXPERT,
        'Candidatures enregistrées'           => (string) $candidates,
        'Dossier privé des fichiers'          => $root !== '' ? $root . ' (accessible en écriture)' : 'INDISPONIBLE : régler OPEM_FORMS_PRIVATE_DIR dans wp-config.php',
        'Antivirus'                           => OPEM_FORMS_CLAMSCAN !== '' ? (string) OPEM_FORMS_CLAMSCAN : 'non réglé (OPEM_FORMS_CLAMSCAN)',
        'Origines autorisées'                 => OPEM_FORMS_ORIGINS !== '' ? (string) OPEM_FORMS_ORIGINS : 'toutes (régler OPEM_FORMS_ORIGINS)',
        'PHP upload_max_filesize (≥ 10M)'     => (string) ini_get('upload_max_filesize'),
        'PHP post_max_size (≥ 64M)'           => (string) ini_get('post_max_size'),
        'PHP max_file_uploads (≥ 6)'          => (string) ini_get('max_file_uploads'),
        'Extension zip (contrôle des macros)' => class_exists('ZipArchive') ? 'présente' : 'absente',
    ];
    foreach ($status as $label => $value) {
        printf('<tr><th scope="row">%s</th><td>%s</td></tr>', esc_html($label), esc_html($value));
    }
    echo '</tbody></table></div>';
}

/** Export CSV (séparateur point-virgule, pour Excel en français), avec le lien de désinscription. */
add_action('admin_post_opem_newsletter_csv', function () {
    if (!current_user_can('manage_options') || !check_admin_referer('opem_newsletter_csv')) {
        wp_die('Accès réservé aux administrateurs.', 'OPEM', ['response' => 403]);
    }
    global $wpdb;
    $rows = $wpdb->get_results("SELECT email, name, lang, source, consented_at, token FROM {$wpdb->prefix}opem_newsletter WHERE unsubscribed_at IS NULL ORDER BY consented_at");
    nocache_headers();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="opem-liste-de-diffusion-' . wp_date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF"); // BOM : accents lisibles dans Excel
    fputcsv($out, ['Courriel', 'Nom', 'Langue', 'Formulaire', 'Date de l’accord', 'Lien de désinscription'], ';');
    foreach ($rows as $row) {
        // Une cellule qui commencerait par = + - @ serait lue comme une formule par Excel.
        $safe = function ($value) {
            $value = (string) $value;
            return preg_match('/^[=+\-@]/', $value) ? "'" . $value : $value;
        };
        fputcsv($out, [
            $safe($row->email),
            $safe($row->name),
            $row->lang,
            $row->source,
            mysql2date('d/m/Y H:i', $row->consented_at),
            opem_forms_unsubscribe_url($row->token),
        ], ';');
    }
    fclose($out);
    exit;
});
