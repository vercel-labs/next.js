#!/usr/bin/env bash
set -uo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
LOGDIR=/workspace/.next-maintainer/reproduction-artifacts/next-server
NAME=${NAME:?}; N=node; OUT=$D/ret-$NAME.txt; rm -f "$OUT"
ITEMS=60 $N "$D/upstream.mjs" > "$LOGDIR/upstream-$NAME.log" 2>&1 & UP=$!
sleep 1
PORT=3000 NODE_ENV=production RETENTION_OUT="$OUT" SECTIONS=30 CACHE_DEPTH=${CACHE_DEPTH:-5} \
  USE_HEADERS=1 MODE=fn $N --expose-gc --require "$D/retention-probe.cjs" --max-old-space-size=2048 \
  "$D/.next/standalone/server.js" > "$LOGDIR/next-server-$NAME.log" 2>&1 & SRV=$!
for _ in $(seq 1 60); do curl -sf http://localhost:3000/p/warm -o /dev/null 2>/dev/null && break; sleep 1; done
for batch in 1 2 3; do
  BASE=http://localhost:3000 REPEAT=${REPEAT:-0} TOTAL=200 CONC=4 OFFSET=$batch $N -e "
    const REPEAT=process.env.REPEAT==='1';const b=$batch;
    let i=0;const jobs=Array.from({length:4},async()=>{while(i<200){const k=i++;const s=REPEAT?'repeated-'+(k%8):'distinct-b'+b+'-'+k;const r=await fetch('http://localhost:3000/p/'+s);await r.arrayBuffer();}});
    await Promise.all(jobs);" 
  kill -USR2 $SRV; sleep 8
  echo "$NAME depth=${CACHE_DEPTH:-5} repeat=${REPEAT:-0} after $((batch*200)) renders: $(grep -E 'seen|reachable|heapUsedMB' $OUT | tr '\n' ' ')"
done
kill -9 $SRV $UP 2>/dev/null; sleep 2
