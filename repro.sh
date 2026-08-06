#!/usr/bin/env bash
# Reproduces https://github.com/vercel/next.js/issues/96806 without Docker.
# Emulates the reporter's Docker runner stage, which copies only
# .next / public / node_modules / package.json into the final image
# (next.config.ts is NOT copied), then runs `next start`.
set -u

npm install
npm run build || exit 1

RUNNER="${TMPDIR:-/tmp}/nextjs-96806-runner"  # outside the project dir, like the Docker image
rm -rf "$RUNNER"; mkdir -p "$RUNNER"
cp -r .next public package.json "$RUNNER"/ 2>/dev/null
ln -s "$(pwd)/node_modules" "$RUNNER/node_modules"

echo
echo "=== A) runner WITHOUT next.config.ts (what the Dockerfile produces) ==="
(cd "$RUNNER" && NODE_ENV=production exec ./node_modules/.bin/next start -p 3010 > /tmp/no-config.log 2>&1) &
PID_A=$!
sleep 10
echo "HTTP status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3010/)"
grep -m1 -A2 DYNAMIC_SERVER_USAGE /tmp/no-config.log || cat /tmp/no-config.log
kill "$PID_A" 2>/dev/null; sleep 2

echo
echo "=== B) same .next, WITH next.config.ts present ==="
cp next.config.ts "$RUNNER"/
(cd "$RUNNER" && NODE_ENV=production exec ./node_modules/.bin/next start -p 3011 > /tmp/with-config.log 2>&1) &
PID_B=$!
sleep 10
echo "HTTP status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3011/)"
echo "DYNAMIC_SERVER_USAGE occurrences: $(grep -c DYNAMIC_SERVER_USAGE /tmp/with-config.log)"
kill "$PID_B" 2>/dev/null
