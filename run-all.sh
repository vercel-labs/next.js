#!/bin/bash
# Full clean run: fresh upstream, fresh production build, next start, Playwright check.
set -x
A=${ART:-/workspace/.next-maintainer/reproduction-artifacts}
mkdir -p "$A/next-server" "$A/playwright"
pkill -9 -f upstream-server.js; pkill -9 -f next-server; pkill -9 -f "next start"
sleep 1
rm -rf .next
node upstream-server.js > "$A/next-server/upstream.log" 2>&1 &
sleep 1
curl -s http://127.0.0.1:4001/stats
npm run build > "$A/next-server/build.log" 2>&1
echo "build stats: $(curl -s http://127.0.0.1:4001/stats)"
npm start > "$A/next-server/start.log" 2>&1 &
sleep 5
curl -s -o /dev/null -w "page:%{http_code}\n" "http://127.0.0.1:${PORT:-3000}/"
SHOT_DIR="$A/playwright" PORT=${PORT:-3000} node test.mjs
echo "exit=$?"
