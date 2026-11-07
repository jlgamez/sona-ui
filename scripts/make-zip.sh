#!/usr/bin/env bash
# Zips the packaged Sona.app for sharing. ditto keeps symlinks, permissions and the signature intact.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/release/mac-arm64/Sona.app"
VERSION="$(node -p "require('$ROOT/package.json').version")"
ZIP="$ROOT/release/Sona-$VERSION-arm64.zip"
if [ ! -d "$APP" ]; then
  echo "App not built: $APP is missing. Run 'npm run pack' first." >&2
  exit 1
fi
rm -f "$ZIP"
ditto -c -k --sequesterRsrc --keepParent "$APP" "$ZIP"
echo "Created $ZIP ($(du -h "$ZIP" | cut -f1))"
