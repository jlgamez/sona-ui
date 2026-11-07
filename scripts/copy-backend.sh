#!/usr/bin/env bash
# Copies the PyInstaller backend folder from the sona repo into resources/ for packaging.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)/../sona/dist/sona-backend"
DEST="$(cd "$(dirname "$0")/.." && pwd)/resources/sona-backend"
if [ ! -x "$SRC/sona-backend" ]; then
  echo "Backend not built: $SRC/sona-backend is missing. Run PyInstaller in the sona repo first." >&2
  exit 1
fi
mkdir -p "$DEST"
rsync -a --delete "$SRC/" "$DEST/"
echo "Copied backend to $DEST"
