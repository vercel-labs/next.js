#!/usr/bin/env bash
# Optional: run the app in a real Pale Moon build under Xvfb (Linux).
# Client-side errors are beaconed to /api/client-error, so they show up in the
# `next start` / `next dev` server log.
set -euo pipefail
URL="${1:-http://localhost:3100/}"
DIR="${TMPDIR:-/tmp}/palemoon-91448"
mkdir -p "$DIR"
if [ ! -x "$DIR/palemoon/palemoon" ]; then
  curl -sL -o "$DIR/pm.tar.xz" "https://www.palemoon.org/download.php?mirror=us&bits=64&type=linuxgtk3"
  tar -C "$DIR" -xf "$DIR/pm.tar.xz"
fi
mkdir -p "$DIR/profile"
Xvfb :99 -screen 0 1280x900x24 >/dev/null 2>&1 &
sleep 2
DISPLAY=:99 "$DIR/palemoon/palemoon" --profile "$DIR/profile" --no-remote "$URL"
