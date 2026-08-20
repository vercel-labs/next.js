#!/bin/bash
# Deterministic reproduction of https://github.com/vercel/next.js/issues/36774
# on plain Linux: an LD_PRELOAD shim accepts inotify watches but never delivers
# events, exactly like a Docker Desktop bind mount from a Windows/macOS host.
set -u
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --no-audit --fund=false
gcc -shared -fPIC -O2 -o no-inotify-events.so no-inotify-events.c || { echo "gcc required"; exit 1; }

run_case() { # $1 label, $2 next.config.js contents, rest: next dev args
  local label=$1 cfg=$2; shift 2
  echo "$cfg" > next.config.js
  sed -i 's/MESSAGE_V[0-9]*/MESSAGE_V1/' app/page.js
  rm -rf .next
  LD_PRELOAD=$PWD/no-inotify-events.so setsid node node_modules/next/dist/bin/next dev "$@" --port 3000 > "dev-$label.log" 2>&1 < /dev/null &
  for _ in $(seq 1 60); do grep -q "Ready in" "dev-$label.log" && break; sleep 1; done
  sleep 1
  echo "[$label] initial: $(curl -s http://localhost:3000/ | grep -o 'MESSAGE_V[0-9]*' | head -1)"
  sed -i 's/MESSAGE_V1/MESSAGE_V2/' app/page.js
  local out=; local ok=no
  for i in $(seq 1 15); do
    out=$(curl -s http://localhost:3000/ | grep -o 'MESSAGE_V[0-9]*' | head -1)
    [ "$out" = MESSAGE_V2 ] && { echo "[$label] RESULT: change picked up after ~$((i*2))s"; ok=yes; break; }
    sleep 2
  done
  [ $ok = no ] && echo "[$label] RESULT: NO RECOMPILE after 30s (page still serves $out, even on a hard reload)"
  pkill -f "next dev" >/dev/null 2>&1
  sleep 2
}

run_case turbopack            "module.exports = {}"
run_case turbopack-polling    "module.exports = { watchOptions: { pollIntervalMs: 1000 } }"
run_case webpack              "module.exports = {}" --webpack
run_case webpack-polling      "module.exports = { watchOptions: { pollIntervalMs: 1000 } }" --webpack
echo "module.exports = {}" > next.config.js
