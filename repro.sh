#!/usr/bin/env bash
# Docker-free reproduction of https://github.com/vercel/next.js/issues/97358
# Requires pnpm and Node >= 22.10 (needs support for the "module-sync" export condition).
set -euo pipefail
cd "$(dirname "$0")"
rm -rf node_modules .next runner
pnpm install --frozen-lockfile
pnpm build
mkdir -p runner
cp -r .next/standalone/. runner/
mkdir -p runner/.next
cp -r .next/static runner/.next/static

echo "--- traced @swc/helpers files in standalone output ---"
find runner -path '*@swc/helpers*' -name '*interop_require_default*' || true

echo "--- starting standalone server (expect MODULE_NOT_FOUND on 16.3.1) ---"
cd runner
PORT=3000 node server.js
