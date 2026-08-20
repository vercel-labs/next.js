#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/65636
# Builds a pnpm-workspace app with output:"standalone", copies .next/standalone
# to an isolated directory (no workspace node_modules) and starts the server there.
set -euo pipefail
corepack pnpm i
(cd apps/web && corepack pnpm run build)
ISO="${ISO:-/tmp/standalone-iso}"
rm -rf "$ISO"; mkdir -p "$ISO"
cp -a apps/web/.next/standalone/. "$ISO"/
cp -a apps/web/.next/static "$ISO"/apps/web/.next/static
cd "$ISO"
echo "--- node $(node -v) running isolated standalone server ---"
PORT="${PORT:-3000}" node apps/web/server.js
