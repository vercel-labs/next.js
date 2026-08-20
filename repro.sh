#!/usr/bin/env bash
# Reproduces issue #71826 without Docker: standalone server.js binds to
# process.env.HOSTNAME, which Docker/Swarm auto-sets to the task's hostname,
# so the published port (a different IP) gets "empty reply from server".
set -u
npm install --no-audit --fund=false
npx next build
cp -r .next/static .next/standalone/.next/static 2>/dev/null

cd .next/standalone

echo "=== case 1: HOSTNAME unset (expected: binds 0.0.0.0, curl works)"
node server.js > /tmp/case1.log 2>&1 & pid=$!; sleep 5
head -5 /tmp/case1.log
curl -sS -m 5 -o /dev/null -w "curl 127.0.0.1:3000 -> %{http_code}\n" http://127.0.0.1:3000/
kill $pid; wait $pid 2>/dev/null

echo "=== case 2: HOSTNAME set by Docker to a per-task address (expected: BUG, no reply on published address)"
HOSTNAME=127.0.0.2 node server.js > /tmp/case2.log 2>&1 & pid=$!; sleep 5
head -5 /tmp/case2.log
curl -sS -m 5 -o /dev/null -w "curl 127.0.0.1:3000 -> %{http_code}\n" http://127.0.0.1:3000/
curl -sS -m 5 -o /dev/null -w "curl 127.0.0.2:3000 -> %{http_code}\n" http://127.0.0.2:3000/
kill $pid; wait $pid 2>/dev/null

echo "=== case 3: HOSTNAME='\"0.0.0.0\"' (quoted value from a compose file)"
HOSTNAME='"0.0.0.0"' node server.js 2>&1 | head -10
