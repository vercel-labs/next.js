#!/usr/bin/env bash
set -e
npm install
rm -rf .next
npx next build --webpack
echo "metadata files in standalone: $(ls .next/standalone/node_modules/next/dist/lib | grep -c metadata || true)"
node .next/standalone/server.js || echo "standalone server failed to boot (expected)"
