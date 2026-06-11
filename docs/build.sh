#!/bin/bash
# Build the FidgetBat website assets.
# - Copies the live extension code into site/assets/ (powers the playable demo)
# - Packages the extension into site/fidgetbat.zip (the download)
# Re-run after any change to the extension so the site stays in sync.
set -euo pipefail
cd "$(dirname "$0")"

mkdir -p assets
cp ../content.js assets/fidgetbat.js
cp ../overlay.css assets/overlay.css

rm -f fidgetbat.zip
TMP=$(mktemp -d)
mkdir "$TMP/FidgetBat"
cp ../manifest.json ../background.js ../content.js ../overlay.css ../README.md "$TMP/FidgetBat/"
(cd "$TMP" && zip -rq fidgetbat.zip FidgetBat)
mv "$TMP/fidgetbat.zip" .
rm -rf "$TMP"

echo "Built: assets/fidgetbat.js, assets/overlay.css, fidgetbat.zip ($(du -h fidgetbat.zip | cut -f1))"
