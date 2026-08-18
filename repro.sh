#!/usr/bin/env bash
# Reproduces https://github.com/vercel/next.js/issues/97521
# `next upgrade` hardcodes `npx @next/codemod@canary`, which no registry with a
# minimum-release-age gate can serve (canary is published multiple times a day).
set -u
MIN_AGE_DAYS="${MIN_AGE_DAYS:-7}"

echo "== starting age-gated proxy registry (min age ${MIN_AGE_DAYS}d) =="
MIN_AGE_DAYS="$MIN_AGE_DAYS" node age-gate-registry.mjs > registry.log 2>&1 &
REGISTRY_PID=$!
trap 'kill $REGISTRY_PID 2>/dev/null' EXIT
sleep 1

echo "== installing project deps through the gated registry (works) =="
npm install --no-audit --no-fund || exit 1

echo "== npx next upgrade (expected to fail) =="
npx next upgrade < /dev/null
echo "exit code: $?"

echo "== bonus: dist-tag resolution inside the codemod also fails =="
npx --yes @next/codemod@16.3.0 upgrade latest < /dev/null
echo "exit code: $?"
