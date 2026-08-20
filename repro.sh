#!/usr/bin/env bash
# Force the client-reference-manifest read/write race.
#
# The dev server rewrites `.next/server/app/<page>_client-reference-manifest.js`
# on every rebuild, and in dev it re-reads that file on every request
# (`shouldCache: !this.isDev`). Overlap the two: keep requests in flight
# continuously while the bundler keeps rewriting the manifests.
set -u
PORT=5177
DURATION=${1:-90}
ROUTES=(/ /about /pricing /docs /blog /contact /terms /privacy /support /login /signup /dashboard)

rm -rf .next
npm run dev > dev.log 2>&1 &
DEV_PID=$!
cleanup() { kill $DEV_PID 2>/dev/null; pkill -P $$ 2>/dev/null; }
trap cleanup EXIT

until curl -sf -o /dev/null -m 2 "http://localhost:$PORT/"; do sleep 0.5; done
echo "dev server up; hammering for ${DURATION}s"

END=$(( $(date +%s) + DURATION ))

# Eight request loops, always in flight.
for _ in $(seq 1 8); do
  (
    while [ "$(date +%s)" -lt "$END" ]; do
      for r in "${ROUTES[@]}"; do
        curl -s -o /dev/null -m 10 "http://localhost:$PORT$r"
      done
    done
  ) &
done

# Rebuild continuously underneath them.
(
  i=0
  while [ "$(date +%s)" -lt "$END" ]; do
    i=$((i + 1))
    printf '\n// rebuild %s\n' "$i" >> app/counter.jsx
    sleep 0.35
  done
) &

while [ "$(date +%s)" -lt "$END" ]; do
  if grep -q "Manifest file is empty" dev.log; then
    echo "REPRODUCED"
    grep -n "Manifest file is empty" dev.log | head -3
    grep -cE "^ (GET|POST).* 500 " dev.log | sed 's/^/500 responses: /'
    exit 0
  fi
  sleep 1
done
echo "not reproduced in ${DURATION}s"
grep -cE " 500 " dev.log | sed 's/^/500 responses: /'
exit 1
