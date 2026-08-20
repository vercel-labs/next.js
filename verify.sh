#!/usr/bin/env bash
# Usage: bash verify.sh [next-version ...]   (default: 13.0.0 13.1.0 14.2.15 latest)
set -u
VERSIONS=${@:-"13.0.0 13.1.0 14.2.15 latest"}
PORT=3000
for v in $VERSIONS; do
  echo "=== next@$v ==="
  rm -rf .next node_modules/.cache
  npm i --no-audit --no-fund --silent "next@$v" react@18.3.1 react-dom@18.3.1 >/dev/null 2>&1
  npx next dev -p $PORT > "dev-$v.log" 2>&1 &
  PID=$!
  for i in $(seq 1 40); do curl -s -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done
  echo "--- OPTIONS /api/hello (preflight) ---"
  curl -s -i -X OPTIONS "http://localhost:$PORT/api/hello" -H 'origin: https://acme.com' -H 'access-control-request-method: POST'
  echo
  echo "--- server log tail ---"
  tail -5 "dev-$v.log"
  kill $PID 2>/dev/null; wait $PID 2>/dev/null
  PORT=$((PORT+1))
done
