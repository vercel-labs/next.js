#!/bin/bash
set -x
L=${LOG:-/tmp/next-dev.log}
rm -f "$L"
NEXT_MANUAL_SIG_HANDLE=true node node_modules/next/dist/bin/next dev -p 3002 > "$L" 2>&1 &
PID=$!
for i in $(seq 1 40); do curl -sf -o /dev/null http://localhost:3002/ && break; sleep 1; done
curl -s -o /dev/null -w "GET / -> %{http_code}\n" http://localhost:3002/
echo "--- SIGTERM to next dev (pid $PID) ---"
kill -TERM $PID
for i in $(seq 1 8); do kill -0 $PID 2>/dev/null && echo "t+${i}s alive" || { echo "t+${i}s exited"; break; }; sleep 1; done
echo "=== log ==="; cat "$L"
