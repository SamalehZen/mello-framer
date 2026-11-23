#!/usr/bin/env bash
#
# Publishes the current build to the production webroot.
#
# Production is a plain directory served by nginx, so this is the whole deploy:
# back up what is live, rebuild from the checked-out commit, mirror the result.
# It exists because the manual copy had drifted for weeks (a missing og-image),
# with nothing on screen to show it.
#
#   PROD_DIR=/var/www/site/mello scripts/deploy-prod.sh
#
set -euo pipefail

: "${PROD_DIR:?set PROD_DIR to the production webroot, e.g. /var/www/site/mello}"

# The build writes to dist/ relative to the project root, not the caller.
cd "$(dirname "$0")/.."

fail() {
  printf 'deploy: %s\n' "$1" >&2
  exit 1
}

[[ -d "$PROD_DIR" ]] || fail "PROD_DIR does not exist: $PROD_DIR"
[[ -f "$PROD_DIR/index.html" ]] || fail "PROD_DIR does not look like a webroot (no index.html): $PROD_DIR"

# `rsync --delete` mirrors, so a wrong target would wipe a sibling site.
case "$PROD_DIR" in
  / | /var | /var/www | /usr/share/nginx/html)
    fail "refusing to deploy to $PROD_DIR: pick the site's own directory"
    ;;
esac

[[ "$(git rev-parse --abbrev-ref HEAD)" == 'main' ]] || fail 'deploy from main only'
[[ -z "$(git status --porcelain)" ]] || fail 'working tree is dirty: commit or stash first'

stamp=$(date -u +%Y%m%d-%H%M%S)
backup_dir=${PROD_BACKUP_DIR:-$(dirname "$PROD_DIR")}
backup="$backup_dir/backup-$(basename "$PROD_DIR")-$stamp.tar.gz"
tar -czf "$backup" -C "$(dirname "$PROD_DIR")" "$(basename "$PROD_DIR")"
printf 'deploy: backup written to %s\n' "$backup"

BASE=/mello/ npm run build

# Mirror, but keep the mirror itself readable by the web server.
rsync -a --delete --chmod=D755,F644 dist/ "$PROD_DIR/"

printf 'deploy: %s published to %s (%s files)\n' \
  "$(git rev-parse --short HEAD)" "$PROD_DIR" "$(find dist -type f | wc -l)"