#!/bin/bash
set -x
L=${LOG:-/tmp/next-norequest.log}
rm -f "$L"
NEXT_MANUAL_SIG_HANDLE=true node node_modules/next/dist/bin/next start -p 3001 > "$L" 2>&1 &
PID=$!
sleep 5
echo "--- SIGTERM without ever serving a request ---"
kill -TERM $PID
for i in $(seq 1 8); do kill -0 $PID 2>/dev/null && echo "t+${i}s alive" || { echo "t+${i}s exited"; break; }; sleep 1; done
echo "=== log ==="; cat "$L"
