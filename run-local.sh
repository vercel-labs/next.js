#!/usr/bin/env bash
# lsof-free variant of run-ret.sh
set -uo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
LOGDIR=${LOGDIR:-$D/logs}; mkdir -p "$LOGDIR"
NAME=${NAME:?set NAME}
RENDERS=${RENDERS:-200}
N=${NODE_BIN:-node}
OUT=$D/ret-$NAME.txt
rm -f "$OUT"

ITEMS=${ITEMS:-60} $N "$D/upstream.mjs" > "$LOGDIR/upstream-$NAME.log" 2>&1 &
UP=$!
sleep 1

PORT=3000 NODE_ENV=production RETENTION_OUT="$OUT" \
  SECTIONS=${SECTIONS:-30} CACHE_DEPTH=${CACHE_DEPTH:-5} \
  USE_HEADERS=${USE_HEADERS:-1} MODE=${MODE:-fn} \
  $N --expose-gc --require "$D/retention-probe.cjs" --max-old-space-size=${HEAP:-2048} \
  "$D/.next/standalone/server.js" > "$LOGDIR/next-server-$NAME.log" 2>&1 &
SRV=$!

for _ in $(seq 1 60); do
  curl -sf http://localhost:3000/p/warm -o /dev/null 2>/dev/null && break
  sleep 1
done

BASE=http://localhost:3000 REPEAT=${REPEAT:-0} TOTAL=$RENDERS CONC=${CONC:-4} $N "$D/load.mjs" > "$LOGDIR/load-$NAME.log" 2>&1
tail -3 "$LOGDIR/load-$NAME.log"
kill -USR2 "$SRV"; sleep 8
cat "$OUT"

SEEN=$(awk -F': *' '/seen/{print $2}' "$OUT" | tr -d ' ')
SAMP=$(awk -F': *' '/sampled/{print $2}' "$OUT" | tr -d ' ')
ALIVE=$(awk -F': *' '/reachable/{print $2}' "$OUT" | tr -d ' ')
HEAP_MB=$(awk -F': *' '/heapUsedMB/{print $2}' "$OUT" | tr -d ' ')
python3 -c "
seen=$SEEN; samp=$SAMP; alive=$ALIVE; r=$RENDERS
ret = seen*alive/samp if samp else 0
print(f'RET $NAME  mode=${MODE:-fn} depth=${CACHE_DEPTH:-5}  created={seen/r:6.1f}/render  retained={ret/r:6.1f}/render  heapPostGC=${HEAP_MB}MB')"
kill -9 $SRV $UP 2>/dev/null
sleep 2
