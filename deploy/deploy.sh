#!/usr/bin/env bash
# ==========================================================================
# Mise en ligne du site sur le VPS, en une commande (depuis la racine du projet) :
#
#     bash deploy/deploy.sh
#
# 1. vérifie le code (tests) et construit le site avec l'adresse définitive ;
# 2. l'envoie sur le serveur dans un nouveau dossier daté (releases/AAAAMMJJ-HHMMSS) ;
# 3. bascule le site dessus d'un coup (lien « current ») : jamais de site à moitié copié ;
# 4. garde les 5 dernières versions pour revenir en arrière (voir deploy/README.md).
#
# Réglages : deploy/deploy.env (copie de deploy/deploy.env.example, jamais commitée).
# Fonctionne dans Git Bash (Windows), macOS et Linux : seuls ssh et tar sont nécessaires.
# ==========================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f deploy/deploy.env ]]; then
  echo "Il manque deploy/deploy.env : copiez deploy/deploy.env.example et remplissez-le." >&2
  exit 1
fi
# shellcheck source=/dev/null
source deploy/deploy.env

: "${DEPLOY_HOST:?DEPLOY_HOST manquant dans deploy/deploy.env}"
: "${SITE_URL:?SITE_URL manquant dans deploy/deploy.env}"
: "${VITE_WP_API_URL:?VITE_WP_API_URL manquant dans deploy/deploy.env}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/opem/site}"
KEEP="${KEEP:-5}"
RELEASE="$(date +%Y%m%d-%H%M%S)"

echo "→ Tests"
npm test --silent

echo "→ Construction pour $SITE_URL"
SITE_URL="$SITE_URL" VITE_WP_API_URL="$VITE_WP_API_URL" npm run build --silent

echo "→ Envoi vers $DEPLOY_HOST:$DEPLOY_DIR/releases/$RELEASE"
tar -C dist -czf - . | ssh "$DEPLOY_HOST" "
  set -e
  mkdir -p '$DEPLOY_DIR/releases/$RELEASE'
  tar -xzf - -C '$DEPLOY_DIR/releases/$RELEASE'
  ln -sfn '$DEPLOY_DIR/releases/$RELEASE' '$DEPLOY_DIR/current.tmp'
  mv -Tf '$DEPLOY_DIR/current.tmp' '$DEPLOY_DIR/current'
  cd '$DEPLOY_DIR/releases' && ls -1t | tail -n +$((KEEP + 1)) | xargs -r rm -rf
"

echo "✓ En ligne : $SITE_URL (version $RELEASE)"
