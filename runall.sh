#!/bin/bash
# Runs every proxy mode against `next start` and prints what the browser sees.
set -u
ART=/workspace/.next-maintainer/reproduction-artifacts
npx next start -p 3000 > "${ART}/next-server/next-start.log" 2>&1 &
PROD=$!
for i in $(seq 30); do curl -sf -o /dev/null http://localhost:3000/ && break; sleep 1; done
for M in passthru decode strip truncate; do
  MODE=$M PORT=3999 node proxy.mjs > /tmp/proxy-$M.log 2>&1 &
  PX=$!
  sleep 1
  echo "================ MODE=$M"
  TAG=$M timeout 120 node check.mjs 2>&1 | grep -v "_next/static" | head -25
  kill $PX
  sleep 1
done
kill $PROD
