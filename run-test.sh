#!/bin/bash
# Reproduces vercel/next.js#51404: graceful-shutdown signal handlers registered
# per the docs (module scope of layout) and via instrumentation register().
set -x
L=${LOG:-/tmp/next-start.log}
rm -f "$L"
NEXT_MANUAL_SIG_HANDLE=true node node_modules/next/dist/bin/next start -p 3000 > "$L" 2>&1 &
SERVER_PID=$!
for i in $(seq 1 40); do curl -sf -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -s -o /dev/null -w "GET / -> %{http_code}\n" http://localhost:3000/
echo "--- sending SIGTERM to next start (pid $SERVER_PID) ---"
kill -TERM $SERVER_PID
for i in $(seq 1 8); do
  if kill -0 $SERVER_PID 2>/dev/null; then echo "t+${i}s: still alive"; else echo "t+${i}s: exited"; break; fi
  sleep 1
done
echo "=== server log ==="
cat "$L"
