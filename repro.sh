#!/usr/bin/env bash
# Reproduction for vercel/next.js#73382
# Two production Next.js server processes (like two containers behind a load
# balancer) share ONE cache store via ./cache-handler.js. The process that did
# NOT render the page returns the cached HTML with NO Cache-Control header.
set -e
cd "$(dirname "$0")"
rm -rf .shared-cache logs
mkdir -p logs
[ -d node_modules ] || npm install
npm run build

npm run start:a > logs/server-a.log 2>&1 &
A=$!
npm run start:b > logs/server-b.log 2>&1 &
B=$!
trap 'kill $A $B 2>/dev/null' EXIT

for i in $(seq 1 60); do
  if curl -sf -o /dev/null http://localhost:3001/isr/warmup-ignore -m 5 \
     && curl -sf -o /dev/null http://localhost:3002/isr/warmup-ignore -m 5; then break; fi
  sleep 1
done

show() { curl -s -o /dev/null -D - "$1" | grep -iE '^(HTTP|x-nextjs-cache|cache-control)'; }

echo
echo "=== 1. server A renders /isr/foo (cache MISS -> writes shared cache) ==="
show http://localhost:3001/isr/foo
echo
echo "=== 2. server A serves it again ==="
show http://localhost:3001/isr/foo
echo
echo "=== 3. server B serves the SAME entry from the shared cache (BUG) ==="
show http://localhost:3002/isr/foo
echo
echo "=== 4. server B again ==="
show http://localhost:3002/isr/foo
echo
echo "Expected: every response has 'Cache-Control: s-maxage=60, ...'"
echo "Actual:   responses from server B have NO Cache-Control header."
