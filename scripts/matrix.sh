#!/bin/bash
# Runs the check against several Next.js versions.
set -u
for v in "$@"; do
  rm -rf .next
  npm install --silent next@"$v" >/dev/null 2>&1
  setsid npx next dev -p 3100 > "dev-$v.log" 2>&1 &
  PID=$!
  sleep 20
  BASE_URL=http://localhost:3100 SCREENSHOT="result-$v.png" node scripts/check.mjs 2>&1 | tail -3
  kill -9 -$PID 2>/dev/null
  sleep 4
done
