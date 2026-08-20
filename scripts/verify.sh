#!/usr/bin/env bash
# Headless equivalent of "start the VS Code debugger and load the home page".
# 1. runs `next dev` under `node --inspect` (same inspector VS Code attaches to)
# 2. attaches a CDP client, requests /, and prints every Debugger.scriptParsed
#    whose sourceMapURL cannot be read - the exact message VS Code logs.
set -u
PORT=${PORT:-3000}
INSPECT=${INSPECT:-9229}
mkdir -p logs
rm -rf .next
NODE_OPTIONS="--inspect=$INSPECT" npx next dev -p "$PORT" > logs/next-dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 60); do
  grep -q "Ready in" logs/next-dev.log && break
  sleep 1
done
# Next.js forks a router server; it is inspected on INSPECT+1.
CHILD=$((INSPECT + 1))
INSPECT_PORT=$CHILD CDP_SECONDS=${CDP_SECONDS:-30} node scripts/cdp-check.js > logs/cdp.log 2>&1 &
CDP_PID=$!
sleep 3
curl -s -m 90 -o /dev/null -w "GET / -> %{http_code}\n" "http://localhost:$PORT/"
wait $CDP_PID; CDP_STATUS=$?
echo "--- debugger source map report -------------------------------"
cat logs/cdp.log
echo "--- bare sourceMappingURL comments in server chunks ----------"
node scripts/check-chunk-comments.js; CHUNK_STATUS=$?
kill $DEV_PID 2>/dev/null
pkill -f "next-server" 2>/dev/null
echo "-------------------------------------------------------------"
if [ $CDP_STATUS -ne 0 ] || [ $CHUNK_STATUS -ne 0 ]; then
  echo "REPRODUCED: the debugger was told to read source maps that do not exist."
  exit 1
fi
echo "NOT REPRODUCED: every sourceMapURL reported to the debugger resolved."
