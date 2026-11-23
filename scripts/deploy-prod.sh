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

# The build writes to dist/ relative to the project root, and every guard below
# compares physical paths, so both sides are resolved before any comparison.
cd "$(dirname "$0")/.."
repo_root=$(pwd -P)

fail() {
  printf 'deploy: %s\n' "$1" >&2
  exit 1
}

[[ -d "$PROD_DIR" ]] || fail "PROD_DIR does not exist: $PROD_DIR"
target=$(cd "$PROD_DIR" && pwd -P)
[[ -f "$target/index.html" ]] || fail "PROD_DIR does not look like a webroot (no index.html): $target"

# `rsync --delete` mirrors, so a wrong target would wipe a sibling site — or the
# checkout itself, which is what `.`, `..` or a path inside the repo would do.
case "$target" in
  / | /var | /var/www | /usr/share/nginx/html) fail "refusing to deploy to $target" ;;
esac
case "$target/" in
  "$repo_root/"*) fail "refusing to deploy into the repository: $target" ;;
esac
case "$repo_root/" in
  "$target/"*) fail "refusing to mirror over a directory that contains the repository: $target" ;;
esac

[[ "$(git rev-parse --abbrev-ref HEAD)" == 'main' ]] || fail 'deploy from main only'
[[ -z "$(git status --porcelain)" ]] || fail 'working tree is dirty: commit or stash first'

# The backup has to survive the mirror, so it cannot live inside it.
backup_dir=${PROD_BACKUP_DIR:-$(dirname "$target")}
mkdir -p "$backup_dir"
backup_dir=$(cd "$backup_dir" && pwd -P)
case "$backup_dir/" in
  "$target/"*) fail 'PROD_BACKUP_DIR must stay outside PROD_DIR, or the mirror deletes the backup' ;;
esac

backup="$backup_dir/backup-$(basename "$target")-$(date -u +%Y%m%d-%H%M%S)-$RANDOM$RANDOM.tar.gz"
if [[ -e "$backup" ]]; then
  fail "backup already exists: $backup"
fi
tar -czf "$backup" -C "$(dirname "$target")" "$(basename "$target")"
printf 'deploy: backup written to %s\n' "$backup"

BASE=/mello/ npm run build

# --delete-after copies first and deletes last: a transfer interrupted midway
# leaves the live site intact instead of pointing at files that never arrived.
rsync -a --delete-after --chmod=D755,F644 dist/ "$target/"

# A build made with the wrong base path references paths that do not exist; the
# page would still answer 200 while every asset 404s.
mapfile -t referenced < <(grep -oE '/mello/(assets|icons)/[A-Za-z0-9._-]+' "$target/index.html" | sort -u)
[[ ${#referenced[@]} -gt 0 ]] || fail "no /mello/ asset reference in index.html: built with the wrong BASE?"

for path in "${referenced[@]}"; do
  if [[ ! -f "$target/${path#/mello/}" ]]; then
    fail "published build references a missing file: $path"
  fi
done

printf 'deploy: %s published to %s (%s files, %s referenced assets verified)\n' \
  "$(git rev-parse --short HEAD)" "$target" "$(find dist -type f | wc -l)" "${#referenced[@]}"