#!/usr/bin/env bash
# stream SSE, then abruptly kill the client
PORT=${PORT:-3000}
curl -sN -X POST -H 'Content-Type: application/json' -d '{"foo":"bar"}' \
  "http://localhost:$PORT/api/sse" & PID=$!
sleep 3
kill -9 $PID
echo "client killed; check the Next.js server console"
