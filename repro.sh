#!/bin/bash
# Usage: NEXT_VERSION=15.2.2-canary.0 ./repro.sh   (or 16.3.1 / canary to see the fix)
set -e
cd "$(dirname "$0")"
VER=${NEXT_VERSION:-15.2.2-canary.0}
npm install --no-audit --no-fund
npm install "next@$VER" --no-audit --no-fund
npx playwright install chromium --with-deps
pkill -f next-server || true
(npx next dev ${NEXT_DEV_FLAGS:-} > next-dev.log 2>&1 &)
sleep 20
node suspend-proxy.mjs > proxy.log 2>&1 &
sleep 1
PROXY_PID=$(pgrep -f suspend-proxy.mjs | head -1) TAG="$VER" node hmr-sleep-test.mjs
