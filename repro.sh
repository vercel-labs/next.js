#!/usr/bin/env bash
# Repro for vercel/next.js#77531 — the Cache-Control header is dropped on the
# first response that `next start` serves from a full-route-cache entry which
# was written to disk by a *previous* server process.
set -u
PORT=${PORT:-3123}
LOG=${LOG:-next-start.log}
PATHS=${PATHS:-"/ok/4 /player/4"}

req() { curl -s -o /dev/null -D - "http://localhost:$PORT$1" | tr -d '\r'; }
show() { grep -iE '^(HTTP/|x-nextjs-cache|cache-control)' <<< "$1" | sed 's/^/      /'; }
start() {
  setsid npx next start -p "$PORT" >> "$LOG" 2>&1 &
  echo $! > .repro.pid
  for _ in $(seq 1 60); do grep -q "Ready in" "$LOG" && break; sleep 0.5; done
  sleep 2
}
stop() { kill -- "-$(cat .repro.pid)" 2>/dev/null; sleep 2; }

rm -f "$LOG"; rm -rf .next
npx next build || exit 1

echo "### boot 1: first request per path is a MISS and writes .next/server/app/<path>.{html,rsc,meta}"
start
for p in $PATHS; do echo "   $p"; show "$(req "$p")"; done
stop

fail=0
echo "### boot 2: fresh process, cache entries already on disk"
start
for p in $PATHS; do
  h="$(req "$p")"
  echo "   $p (first request of this process)"; show "$h"
  grep -qi '^cache-control' <<< "$h" || { echo "      ^^ BUG: no Cache-Control on this cached response"; fail=1; }
  echo "   $p (second request)"; show "$(req "$p")"
done
stop
echo
[ "$fail" = 1 ] && echo "RESULT: reproduced (#77531)" || echo "RESULT: not reproduced"
