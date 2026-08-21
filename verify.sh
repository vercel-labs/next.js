#!/usr/bin/env bash
# Usage: npm install && bash verify.sh [compile|full]
set -euo pipefail
MODE="${1:-compile}"
PORT="${PORT:-3123}"

rm -rf .next
if [ "$MODE" = "compile" ]; then
  npx next build --experimental-build-mode compile
else
  npx next build
fi

# `output: "standalone"` never copies .next/static; do it as the docs require.
APP_DIR="$(dirname "$(find .next/standalone -maxdepth 2 -name server.js | head -n1)")"
mkdir -p "$APP_DIR/.next"
cp -r .next/static "$APP_DIR/.next/static"

(cd "$APP_DIR" && HOSTNAME=0.0.0.0 PORT="$PORT" node server.js > /tmp/next-server-$PORT.log 2>&1 &)
sleep 6

ACTION_ID="$(node -e "console.log(Object.keys(require('./.next/server/server-reference-manifest.json').node)[0])")"
echo "action id: $ACTION_ID"
STATUS="$(curl -s -o /tmp/action-body.txt -w '%{http_code}' -X POST "http://localhost:$PORT/" \
  -H "Next-Action: $ACTION_ID" -H 'Content-Type: text/plain;charset=UTF-8' --data '[]')"
echo "POST / with Next-Action -> HTTP $STATUS"
head -c 300 /tmp/action-body.txt; echo
pkill -x node || true
[ "$STATUS" = "200" ] && echo "RESULT: server action WORKS (issue not reproduced)" || echo "RESULT: server action FAILED ($STATUS)"
