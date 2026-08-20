#!/bin/bash
set -e
LOGS=${LOGS:-/workspace/.next-maintainer/reproduction-artifacts/next-server}
mkdir -p "$LOGS"
rm -rf .next
npx next build
echo "== serialized assetPrefix baked into standalone server.js:"
grep -o 'assetPrefix":"[^"]*"' .next/standalone/server.js | head -1
cp -r .next/static .next/standalone/.next/static
(CDN_URI="https://cdn.example.net" PORT=4001 node .next/standalone/server.js > "$LOGS/standalone.log" 2>&1 &)
(CDN_URI="https://cdn.example.net" PORT=4002 npx next start > "$LOGS/next-start.log" 2>&1 &)
sleep 8
echo "== standalone (BUG: no prefix):"
curl -s http://localhost:4001/ | grep -o 'src="[^"]*"' | head -3
echo "== next start (expected: prefixed):"
curl -s http://localhost:4002/ | grep -o 'src="[^"]*"' | head -3
pkill -f "standalone/server.js" || true
pkill -f "next-server" || true
