<?php
/*
 * Lignes à AJOUTER dans /var/www/opem/wordpress/cms/wp-config.php, juste au-dessus de la ligne
 * « That's all, stop editing! » (ou « C'est tout, ne touchez pas à ce qui suit ! »).
 * Ce fichier n'est pas à copier tel quel sur le serveur : seulement son contenu.
 */

// Adresse de WordPress et du site (remplacer le domaine s'il change).
define('WP_HOME', 'https://opem-dz.com/cms');
define('WP_SITEURL', 'https://opem-dz.com/cms');
define('FORCE_SSL_ADMIN', true);

// Formulaires OPEM (wordpress/opem-forms-api.php) : seul le site peut envoyer.
define('OPEM_FORMS_ORIGINS', 'https://opem-dz.com');
// Destinataires (valeurs par défaut de l'extension, à changer au besoin).
define('OPEM_FORMS_TO_CONTACT', 'contact@opem-dz.com');
define('OPEM_FORMS_TO_EXPERT', 'expert@opem-dz.com');
// Fichiers des candidatures : hors de toute adresse publique.
define('OPEM_FORMS_PRIVATE_DIR', '/var/www/opem/wordpress/opem-prive');

// Sécurité : pas de modification de code depuis l'administration.
define('DISALLOW_FILE_EDIT', true);
// Mises à jour de sécurité de WordPress automatiques.
define('WP_AUTO_UPDATE_CORE', 'minor');
