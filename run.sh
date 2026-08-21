#!/usr/bin/env bash
# Reproduction for vercel/next.js#85810
#   Large request bodies are lost/truncated when a Node.js-runtime proxy
#   (proxy.js) reads the request body, because next-server.js calls
#   `requestData.body.finalize()` without awaiting it (fixed by #85418).
#
# FINALIZE_DELAY_MS delays finalize() resolution by that many ms so the race is
# deterministic (0 == one macrotask tick is already enough to fail on 16.0.1).
set -euo pipefail

PORT="${PORT:-3010}"
FINALIZE_DELAY_MS="${FINALIZE_DELAY_MS:-300}"

npm install
npm run build
cp -r .next/static .next/standalone/.next/static
node scripts/amplify-finalize.mjs .next/standalone/node_modules/next/dist/server/body-streams.js

(cd .next/standalone && PORT="$PORT" FINALIZE_DELAY_MS="$FINALIZE_DELAY_MS" node server.js > /tmp/repro-85810-server.log 2>&1 &)
sleep 6

echo "--- app route (POST /api/echo) ---"
PORT="$PORT" node scripts/probe-route.mjs
echo "--- server action (POST /action) ---"
PORT="$PORT" node scripts/probe-action.mjs
echo "--- server log ---"
tail -n 30 /tmp/repro-85810-server.log
