#!/usr/bin/env bash
# Verifies whether a root-level proxy.ts runs in an `output: "standalone"` build.
# Usage: bash verify.sh            (Turbopack build, default)
#        BUILDER=--webpack bash verify.sh
#        VARIANT=middleware bash verify.sh   (build the middleware.ts control instead)
set -euo pipefail
PORT="${PORT:-3010}"
BUILDER="${BUILDER:-}"
VARIANT="${VARIANT:-proxy}"

if [ "$VARIANT" = "middleware" ]; then
  cp control/middleware.ts ./middleware.ts
  rm -f proxy.ts
fi

rm -rf .next
npx next build $BUILDER

cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
[ -d public ] && cp -r public .next/standalone/ || true

echo "--- functions-config-manifest.json"
cat .next/server/functions-config-manifest.json
echo
echo "--- standalone .next/server listing"
ls .next/standalone/.next/server

PORT="$PORT" node .next/standalone/server.js > server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
sleep 5

echo "--- response headers"
curl -si "http://localhost:$PORT/" | head -5
echo "--- server log"
cat server.log
