#!/usr/bin/env bash
# Retention measurement for the repro: drive N renders, force GC, count how many abort-reason
# Errors are still reachable. Less noisy than renders-to-OOM, which varies 199..2109 run to run.
#
#   NAME=comp5 MODE=comp CACHE_DEPTH=5 RENDERS=300 ./run-ret.sh
set -uo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
NAME=${NAME:?set NAME}
RENDERS=${RENDERS:-300}
N=${NODE_BIN:-node}
OUT=$D/ret-$NAME.txt

kill_port() {
  for _ in $(seq 1 15); do
    P=$(lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null)
    [ -z "$P" ] && return 0
    echo "$P" | xargs -r kill -9 2>/dev/null; sleep 1
  done
}
kill_port 3000; kill_port 3101
rm -f "$OUT"

ITEMS=${ITEMS:-60} $N "$D/upstream.mjs" > "$D/up-$NAME.log" 2>&1 &
sleep 1

PORT=3000 NODE_ENV=production RETENTION_OUT="$OUT" \
  SECTIONS=${SECTIONS:-30} CACHE_DEPTH=${CACHE_DEPTH:-5} \
  USE_HEADERS=${USE_HEADERS:-1} MODE=${MODE:-fn} \
  $N --expose-gc --require "$D/retention-probe.cjs" --max-old-space-size=4096 \
  "$D/.next/standalone/server.js" > "$D/srv-$NAME.log" 2>&1 &

for _ in $(seq 1 60); do
  curl -sf http://localhost:3000/p/warm -o /dev/null 2>/dev/null && break
  sleep 1
done
grep -q EADDRINUSE "$D/srv-$NAME.log" 2>/dev/null && { echo "!! $NAME stale server"; exit 1; }

BASE=http://localhost:3000 TOTAL=$RENDERS CONC=8 $N "$D/load.mjs" > "$D/load-$NAME.log" 2>&1
PID=$(lsof -nP -iTCP:3000 -sTCP:LISTEN -t | head -1)
kill -USR2 "$PID"; sleep 5

SEEN=$(awk -F': *' '/seen/{print $2}' "$OUT" | tr -d ' ')
SAMP=$(awk -F': *' '/sampled/{print $2}' "$OUT" | tr -d ' ')
ALIVE=$(awk -F': *' '/reachable/{print $2}' "$OUT" | tr -d ' ')
HEAP_MB=$(awk -F': *' '/heapUsedMB/{print $2}' "$OUT" | tr -d ' ')
python3 -c "
seen=$SEEN; samp=$SAMP; alive=$ALIVE; r=$RENDERS
ret = seen*alive/samp if samp else 0
print(f'RET $NAME  mode=${MODE:-fn} depth=${CACHE_DEPTH:-5}  created={seen/r:6.1f}/render  retained={ret/r:6.1f}/render  heapPostGC=${HEAP_MB}MB')"

kill_port 3000; kill_port 3101
