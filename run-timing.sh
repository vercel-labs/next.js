#!/bin/bash
pkill -f '^next-server'; sleep 2
set -u
LABEL=$1; PORT=$2; shift 2
ART=/workspace/.next-maintainer/reproduction-artifacts/next-server
LOG=$ART/$LABEL.log
rm -rf .next
nohup npx next dev --port "$PORT" "$@" > "$LOG" 2>&1 &
for i in $(seq 1 60); do
  curl -s -o /dev/null --max-time 5 "http://localhost:$PORT/" && break
  sleep 1
done
node -e '
const port=process.argv[1], label=process.argv[2];
(async()=>{
 for (const n of [1,2]) {
  const t=Date.now();
  try{
   const r=await fetch(`http://localhost:${port}/heavy`);
   const b=await r.text();
   console.log(`${label} request${n}: status=${r.status} bytes=${b.length} elapsed=${((Date.now()-t)/1000).toFixed(1)}s`);
  }catch(e){ console.log(`${label} request${n}: FAILED after ${((Date.now()-t)/1000).toFixed(1)}s ${e.message}`); }
 }
})()' "$PORT" "$LABEL"
