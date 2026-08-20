#!/usr/bin/env bash
set -e
PORT=${PORT:-3000}
npm install --no-audit --fund=false
npx next build
npx next start -p "$PORT" > next-server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
until curl -sf "http://localhost:$PORT/" > /dev/null; do sleep 1; done
echo "--- with x-forwarded-proto: https (BUG) ---"
curl -s -H 'x-forwarded-proto: https' "http://localhost:$PORT/middleware-test"; echo
echo "--- without x-forwarded-proto (works) ---"
curl -s "http://localhost:$PORT/middleware-test"; echo
