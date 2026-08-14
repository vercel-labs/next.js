#!/bin/bash
# Reproduces vercel/next.js#97344.
#
# Starts a bandwidth-limited HTTP CONNECT proxy (default 700 KB/s aggregate) and
# runs `next dev` behind it, then requests `/` once. The app loads 7 Japanese
# (CJK) families from next/font/google, which makes Turbopack fetch ~1480
# individual woff2 slices from fonts.gstatic.com while compiling the layout.
#
# Next >= 16.3.0: several fetches exceed the new dev fetch budget
# (connect 5s / total 10s, max_retries: 1) and the font files become
# unresolvable modules -> HTTP 500 plus many
#   Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
# Next 16.2.12 (no fetch timeouts): HTTP 200, compilation is just slower.
#
# Usage: PORT=3000 PROXY_RATE=716800 ./scripts/repro.sh
set -u
cd "$(dirname "$0")/.."
PORT=${PORT:-3000}
PROXY_PORT=${PROXY_PORT:-8899}
RATE=${PROXY_RATE:-716800}
LOG=${LOG:-dev.log}

rm -rf .next
PROXY_PORT=$PROXY_PORT PROXY_RATE=$RATE node tools/throttle-proxy.js &
PROXY=$!
sleep 1
HTTPS_PROXY=http://127.0.0.1:$PROXY_PORT \
HTTP_PROXY=http://127.0.0.1:$PROXY_PORT \
NO_PROXY=127.0.0.1,localhost \
  ./node_modules/.bin/next dev --port "$PORT" > "$LOG" 2>&1 &
DEV=$!
sleep 4
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 300 "http://localhost:$PORT/")
sleep 2
echo "GET / -> HTTP $code"
echo "font module-not-found errors: $(grep -ac 'internal/font/google/font' "$LOG")"
echo "font fetch failures:          $(grep -aci 'timed out\|error sending request' "$LOG")"
echo "full dev server log: $LOG"
for p in $(pgrep -P $DEV) $DEV $PROXY; do kill -9 "$p" 2>/dev/null; done
