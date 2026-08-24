#!/usr/bin/env bash
# Builds the app twice (partialPrefetching on, then off) and reports how much of
# the inline RSC payload in the PPR page's HTML is a byte-identical duplicate.
set -uo pipefail
LOG=${LOG_DIR:-.}
npm install
port=3100
for pp in 1 0; do
  echo "=============== partialPrefetching: $pp ==============="
  rm -rf .next
  PARTIAL_PREFETCHING=$pp npx next build > "$LOG/build-pp$pp.log" 2>&1 || { tail -20 "$LOG/build-pp$pp.log"; exit 1; }
  PARTIAL_PREFETCHING=$pp npx next start -p $port > "$LOG/start-pp$pp.log" 2>&1 &
  until curl -sf -o /dev/null "http://localhost:$port/dynamic"; do sleep 1; done
  node analyze.mjs "http://localhost:$port/dynamic"
  pkill -f "next-server.*:$port" >/dev/null 2>&1
  kill %1 >/dev/null 2>&1
  wait %1 2>/dev/null
  port=$((port + 1))
done
