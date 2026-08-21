#!/bin/bash
# Verifies issue #88501: azure-maps-control under Turbopack (pages router).
set -e
npm install
npx playwright install chromium
echo "== next build (Turbopack) =="
npx next build
echo "== syntax-check every emitted client chunk (catches 'Identifier X has already been declared') =="
for f in $(find .next/static -name '*.js'); do
  node --check "$f" || echo "SYNTAX ERROR IN $f"
done
echo "== boot production server and load the map in Chromium =="
npx next start -p 3000 > next-start.log 2>&1 &
sleep 10
node check.mjs http://localhost:3000/ prod-static-import-dynamic
node check.mjs http://localhost:3000/lazy prod-await-import
