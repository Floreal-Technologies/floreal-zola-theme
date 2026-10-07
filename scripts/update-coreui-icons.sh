#!/usr/bin/env bash
set -euo pipefail

VERSION=${1:-latest}
DEST=$(cd "$(dirname "$0")/.." && pwd)/static/icons/coreui

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

(cd "$WORK" && npm pack "@coreui/icons@$VERSION" --silent >/dev/null)
tar -xzf "$WORK"/coreui-icons-*.tgz -C "$WORK"

rm -rf "$DEST"
mkdir -p "$DEST"
cp "$WORK"/package/sprites/free.svg "$DEST"/free.svg
cp "$WORK"/package/sprites/brand.svg "$DEST"/brand.svg
cp "$WORK"/package/LICENSE "$DEST"/LICENSE
chmod 644 "$DEST"/*

got=$(sed -n 's/^  "version": "\(.*\)",$/\1/p' "$WORK"/package/package.json)
echo "$got" > "$DEST"/VERSION
for sprite in free brand; do
  echo "coreui icons $got: $(grep -c '<symbol ' "$DEST"/$sprite.svg) glyphs in ${DEST#"$PWD"/}/$sprite.svg"
done
