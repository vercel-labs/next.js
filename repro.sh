#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/63210
# "Couldn't find all resumable slots by key/index during replaying."
set -uo pipefail
PORT=${PORT:-3000}
LOG=${LOG:-server.log}

npm install
npx next build || exit 1

npx next start -p "$PORT" >"$LOG" 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for _ in $(seq 1 60); do curl -sf -o /dev/null "http://localhost:$PORT/unstable-keys" && break; sleep 0.5; done

echo
echo "=== GET /unstable-keys (PPR resume of the prerendered shell) ==="
curl -s "http://localhost:$PORT/unstable-keys" -o response.html -w "http status: %{http_code}\n"
echo "suspense fallbacks in response: $(grep -c '<li>loading' response.html)"
echo "resolved dynamic children in response: $(grep -c '<li>dynamic' response.html)"
echo
echo "=== server log ==="
cat "$LOG"
