#!/usr/bin/env bash
# Reproduction for vercel/next.js#86511
# "Failed to parse postponed state ... Z_BUF_ERROR" on a PPR/cacheComponents route.
#
# Next's PPR resume path (base-server) takes the *request body* of any
# POST that carries `next-resume: 1` on a deployment-style (minimal mode,
# x-matched-path) server and parses it as the postponed state. A body that
# is not a valid `<len>:<state><base64 deflate resume-data-cache>` blob makes
# the parser fail; a truncated deflate tail produces the exact Z_BUF_ERROR
# ("unexpected end of file") signature from the issue.
#
# Usage: npm install && npm run build && bash repro.sh
set -euo pipefail
PORT="${PORT:-3210}"
LOG="${LOG:-next-server.log}"

rm -f "$LOG"
NEXT_PRIVATE_MINIMAL_MODE=1 NEXT_PRIVATE_TEST_HEADERS=1 \
  npx next start -p "$PORT" >"$LOG" 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://localhost:$PORT/" && break
  sleep 1
done

echo "== 1. plain client body sent as PPR resume body =="
curl -s -o /dev/null -w 'status=%{http_code}\n' -X POST \
  -H 'next-resume: 1' -H 'x-matched-path: /' -d 'x=1' "http://localhost:$PORT/"

echo "== 2. truncated deflate resume-data-cache tail (Z_BUF_ERROR) =="
node -e '
const z = require("zlib");
const full = z.deflateSync(Buffer.from(JSON.stringify({store:{cache:{},fetch:{},encryptedBoundArgs:{}}})));
process.stdout.write("4:null" + full.subarray(0, full.length >> 1).toString("base64"));
' > body.bin
curl -s -o /dev/null -w 'status=%{http_code}\n' -X POST \
  -H 'next-resume: 1' -H 'x-matched-path: /' --data-binary @body.bin "http://localhost:$PORT/"

sleep 1
echo "== server log =="
grep -A9 'Failed to parse postponed state' "$LOG" || {
  echo "NOT REPRODUCED: no parse failure logged"; exit 1; }
