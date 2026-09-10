#!/usr/bin/env bash
# Usage: ./repro.sh deep|shallow
#   deep    = cold start, request the 10-segment route FIRST  -> expected bug: 500 RangeError
#   shallow = cold start, request the 3-segment route FIRST    -> 200, and the deep route is then fine
set -e
FIRST=${1:-deep}
PORT=${PORT:-3999}
DEEP="http://localhost:$PORT/s10/a/b/c/d/e/f/g/h/i"
SHALLOW="http://localhost:$PORT/s3/a/b"

rm -rf .next
npx next dev --port "$PORT" > dev.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null; wait $PID 2>/dev/null; true' EXIT
until grep -q "Ready" dev.log; do sleep 1; done

hit() { printf '%-8s %-45s -> ' "$1" "$2"; curl -s -o /dev/null -w '%{http_code}\n' --max-time 120 "$2"; }

if [ "$FIRST" = deep ]; then
  hit first  "$DEEP"
  hit second "$DEEP"
  hit third  "$SHALLOW"
  hit fourth "$DEEP"
else
  hit first  "$SHALLOW"
  hit second "$DEEP"
fi

grep -m1 -A3 "Maximum call stack size exceeded" dev.log || echo "(no RangeError in dev.log)"
