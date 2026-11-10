# Mettre le site OPEM en ligne sur un VPS

Guide pas à pas, pour une première installation, sans connaissance préalable de WordPress ni
de Nginx. Compter une demi-journée. Chaque bloc de commandes se copie-colle tel quel dans le
terminal du serveur, sauf mention « sur votre ordinateur ».

**Ce que fait l'installation** : un seul serveur sert le site React à `https://opem-dz.com`, et
WordPress à `https://opem-dz.com/cms`. Les visiteurs ne voient jamais WordPress : il reçoit les
formulaires (rendez-vous, candidatures, inscriptions aux éclairages), fournit le menu et la
citation du mois. L'équipe d'OPEM s'y connecte seulement pour ces réglages.

| Fichier                              | Rôle                                                     |
| ------------------------------------ | -------------------------------------------------------- |
| `nginx/opem.conf`                    | le serveur web : site, WordPress, HTTPS, sécurité, cache |
| `nginx/snippets/opem-*-headers.conf` | en-têtes de sécurité (site / WordPress)                  |
| `php/opem.ini`                       | tailles d'envoi pour les CV et documents                 |
| `wordpress/wp-config-opem.php`       | lignes à ajouter au réglage de WordPress                 |
| `deploy.sh` + `deploy.env.example`   | mise en ligne d'une nouvelle version, en une commande    |

Le domaine `opem-dz.com` est écrit dans `nginx/opem.conf`, `wordpress/wp-config-opem.php` et
`deploy.env` : s'il change, le remplacer partout.

---

## 0. Avant de commencer

- **Un VPS sous Ubuntu 24.04**, avec 2 Go de mémoire au minimum. Pour les candidatures (CV,
  pièces d'identité), vérifier avec OPEM le pays d'hébergement (loi n° 18-07).
- **Le domaine** pointé vers le VPS : chez le gestionnaire du domaine, deux enregistrements
  `A`, `opem-dz.com` et `www.opem-dz.com`, vers l'adresse IP du VPS. La prise en compte peut
  prendre quelques heures.
- **Une boîte courriel `@opem-dz.com`** dédiée aux envois du site (ex. `site@opem-dz.com`),
  avec son serveur SMTP, son port et son mot de passe (fournis par l'hébergeur des courriels).

## 1. Se connecter au serveur, créer un utilisateur

Sur votre ordinateur (Git Bash), créer une clé SSH si vous n'en avez pas, puis vous connecter
avec l'accès fourni par l'hébergeur :

```bash
ssh-keygen -t ed25519            # Entrée à chaque question
ssh root@ADRESSE_IP_DU_VPS
```

Sur le serveur, créer l'utilisateur `opem` qui fera la mise en ligne :

```bash
adduser opem                      # choisir un mot de passe solide
usermod -aG sudo opem
```

Sur votre ordinateur, autoriser votre clé pour `opem`, puis vérifier la connexion :

```bash
ssh-copy-id opem@ADRESSE_IP_DU_VPS
ssh opem@ADRESSE_IP_DU_VPS
```

## 2. Pare-feu et mises à jour automatiques

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw unattended-upgrades
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo dpkg-reconfigure -plow unattended-upgrades   # répondre « Oui »
```

## 3. Installer Nginx, PHP et la base de données

```bash
sudo apt install -y nginx mariadb-server certbot \
  php8.3-fpm php8.3-mysql php8.3-curl php8.3-gd php8.3-mbstring php8.3-xml \
  php8.3-zip php8.3-intl php8.3-imagick
sudo mysql_secure_installation    # Entrée, puis « Y » à toutes les questions
```

## 4. Créer la base de données de WordPress

Remplacer `MOT_DE_PASSE_BASE` par un mot de passe long (le noter : il sert à l'étape 5).

```bash
sudo mysql -e "CREATE DATABASE opem_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'opem_wp'@'localhost' IDENTIFIED BY 'MOT_DE_PASSE_BASE';"
sudo mysql -e "GRANT ALL ON opem_wp.* TO 'opem_wp'@'localhost'; FLUSH PRIVILEGES;"
```

## 5. Installer WordPress et les extensions OPEM

```bash
sudo mkdir -p /var/www/opem/site /var/www/opem/wordpress/opem-prive
cd /tmp && wget https://fr.wordpress.org/latest-fr_FR.tar.gz
tar -xzf latest-fr_FR.tar.gz
sudo mv wordpress /var/www/opem/wordpress/cms
sudo cp /var/www/opem/wordpress/cms/wp-config-sample.php /var/www/opem/wordpress/cms/wp-config.php
```

Sur votre ordinateur, depuis la racine du projet, envoyer les extensions et les réglages :

```bash
scp wordpress/*.php deploy/php/opem.ini deploy/wordpress/wp-config-opem.php \
  opem@ADRESSE_IP_DU_VPS:/tmp/
```

Sur le serveur :

```bash
sudo mkdir -p /var/www/opem/wordpress/cms/wp-content/mu-plugins
sudo mv /tmp/opem-*-api.php /tmp/opem-forms-referentiel.php \
  /var/www/opem/wordpress/cms/wp-content/mu-plugins/
sudo mv /tmp/opem.ini /etc/php/8.3/fpm/conf.d/99-opem.ini
sudo systemctl restart php8.3-fpm
```

Régler `wp-config.php` :

```bash
sudo nano /var/www/opem/wordpress/cms/wp-config.php
```

1. Remplacer `database_name_here` par `opem_wp`, `username_here` par `opem_wp`,
   `password_here` par `MOT_DE_PASSE_BASE`.
2. Remplacer le bloc des clés (`put your unique phrase here`) par celui généré à l'adresse
   <https://api.wordpress.org/secret-key/1.1/salt/>.
3. Juste au-dessus de « C'est tout, ne touchez pas à ce qui suit », coller les lignes de
   `/tmp/wp-config-opem.php` (sans la première ligne `<?php` ni le commentaire).
4. Enregistrer : `Ctrl+O`, Entrée, puis `Ctrl+X`.

Donner WordPress et le dossier privé au serveur web, le site à l'utilisateur `opem` :

```bash
sudo chown -R www-data:www-data /var/www/opem/wordpress
sudo chmod 750 /var/www/opem/wordpress/opem-prive
sudo chown -R opem:opem /var/www/opem/site
```

## 6. Nginx et le certificat HTTPS

Obtenir le certificat (Nginx est arrêté une minute ; les renouvellements se feront seuls) :

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d opem-dz.com -d www.opem-dz.com \
  --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"
sudo systemctl start nginx
```

Sur votre ordinateur, envoyer la configuration :

```bash
scp deploy/nginx/opem.conf deploy/nginx/snippets/opem-*.conf opem@ADRESSE_IP_DU_VPS:/tmp/
```

Sur le serveur, l'installer, la vérifier et l'activer :

```bash
sudo mv /tmp/opem-site-headers.conf /tmp/opem-wp-headers.conf /etc/nginx/snippets/
sudo mv /tmp/opem.conf /etc/nginx/sites-available/opem.conf
sudo ln -s /etc/nginx/sites-available/opem.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t                     # doit afficher « syntax is ok » et « test is successful »
sudo systemctl reload nginx
```

## 7. Terminer WordPress dans le navigateur

1. Ouvrir <https://opem-dz.com/cms/wp-admin/install.php>, choisir un identifiant (pas
   « admin ») et un mot de passe solide, et l'adresse courriel d'OPEM.
2. **Réglages > Permaliens** : choisir « Titre de la publication », puis Enregistrer.
   Indispensable : sans cela, l'adresse `/cms/wp-json` lue par le site ne répond pas.
3. **Extensions > Ajouter** : installer et activer « WP Mail SMTP », puis y saisir la boîte
   `site@opem-dz.com` (serveur, port, mot de passe) et envoyer le courriel de test.
4. **Outils > Formulaires OPEM** : vérifier que tous les réglages sont au vert.
5. **Apparence > Menus** (menu du site) et **Réglages > Citation du mois** : à remplir par OPEM
   quand elle le souhaite ; tant que c'est vide, le site garde ses versions intégrées.

## 8. Première mise en ligne du site

Sur votre ordinateur, depuis la racine du projet :

```bash
cp deploy/deploy.env.example deploy/deploy.env
# ouvrir deploy/deploy.env : DEPLOY_HOST=opem@ADRESSE_IP_DU_VPS, et le domaine
bash deploy/deploy.sh
```

Le script lance les tests, construit le site avec la bonne adresse, l'envoie et le met en
ligne. Les fois suivantes, la même commande suffit.

## 9. Vérifier

- <https://opem-dz.com> s'affiche ; <http://opem-dz.com> et <https://www.opem-dz.com> y renvoient.
- Ouvrir <https://opem-dz.com/le-cabinet>, puis recharger la page : elle s'affiche (pas d'erreur 404).
- <https://opem-dz.com/sitemap.xml> et <https://opem-dz.com/robots.txt> s'affichent.
- Envoyer une demande de rendez-vous de test : le courriel arrive à `contact@opem-dz.com`.
- Envoyer une candidature de test avec un CV : le courriel arrive à `expert@opem-dz.com`.
- <https://opem-dz.com/cms> renvoie vers le site (WordPress reste invisible).
- En-têtes de sécurité : `curl -sI https://opem-dz.com | grep -i content-security` affiche la règle.
- Enfin, déclarer le site dans Google Search Console avec l'adresse du plan du site.

---

## Au quotidien

**Mettre en ligne une nouvelle version** : `bash deploy/deploy.sh`.

**Revenir à la version précédente** (sur le serveur) :

```bash
ls -1t /var/www/opem/site/releases          # la 1re est l'actuelle, la 2e la précédente
ln -sfn /var/www/opem/site/releases/AAAAMMJJ-HHMMSS /var/www/opem/site/current
```

**Sauvegardes** (sur le serveur, une fois) : chaque nuit, la base et les fichiers des
candidatures, gardés 14 jours. Penser aussi à la sauvegarde du VPS proposée par l'hébergeur.

```bash
sudo mkdir -p /var/backups/opem
sudo crontab -e
# ajouter cette ligne, puis enregistrer :
30 3 * * * mysqldump opem_wp | gzip > /var/backups/opem/base-$(date +\%F).sql.gz && tar -czf /var/backups/opem/prive-$(date +\%F).tar.gz -C /var/www/opem/wordpress opem-prive && find /var/backups/opem -mtime +14 -delete
```

**Mettre à jour WordPress et ses extensions** : depuis l'administration (Tableau de bord >
Mises à jour), une fois par mois. Les mises à jour de sécurité de WordPress se font seules.
