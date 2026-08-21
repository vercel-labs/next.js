#!/usr/bin/env bash
# Reproduction for vercel/next.js#95528
set -euo pipefail
pnpm install --config.dangerouslyAllowAllBuilds=true
pnpm build
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

echo "=== A) hostname == Host header (HOSTNAME unset -> 0.0.0.0 -> localhost): PASSES ==="
PORT=3001 node .next/standalone/server.js > /tmp/ok.log 2>&1 &
sleep 5; curl -sI http://localhost:3001/beaches | head -1; grep 'proxy invoked' /tmp/ok.log; kill %1

echo "=== B) hostname != Host header (HOSTNAME=127.0.0.1, request Host: localhost): BUG ==="
PORT=3002 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/bug.log 2>&1 &
sleep 5; curl -sI http://localhost:3002/beaches | grep -Ei '^(HTTP|location|x-middleware-rewrite)'; grep 'proxy invoked' /tmp/bug.log; kill %1
