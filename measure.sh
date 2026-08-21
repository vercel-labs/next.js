#!/bin/bash
# measure.sh [churn_seconds] [-- extra next dev args]
# Starts `next dev`, drives edit+request churn, samples dev-server RSS every cycle.
set -u
DUR=${1:-120}
shift || true
[ "${1:-}" = "--" ] && shift
LOG=dev.log
CSV=memory.csv
PAT="nex""t-server"; pkill -9 -f "$PAT" >/dev/null 2>&1; sleep 2
rm -rf .next
[ -d components ] || node gen.mjs 150 20
(npx next dev -p 3000 "$@" > "$LOG" 2>&1 &)
for i in $(seq 1 90); do curl -sf -o /dev/null --max-time 60 http://localhost:3000/r/0 && break; sleep 2; done
echo "elapsed_s,workers,tree_rss_mb,server_rss_mb" > "$CSV"
sample() {
  local n rss srss
  n=$(ps -eo args | grep -cE "[.]next/dev/build/[^ ]*\.js [0-9]+")
  rss=$(ps -eo rss,args | grep -E "[n]ext-server|[.]next/dev/build/|[n]ext dev" | awk '{s+=$1} END{print int(s/1024)}')
  srss=$(ps -eo rss,args | grep -E "[n]ext-server" | awk '{s+=$1} END{print int(s/1024)}')
  echo "$SECONDS,$n,$rss,$srss" >> "$CSV"
  echo "t=${SECONDS}s workers=$n tree=${rss}MB next-server=${srss}MB"
}
i=0
end=$((SECONDS + DUR))
while [ $SECONDS -lt $end ]; do
  i=$((i + 1))
  for k in 0 1 2; do
    idx=$(( (i * 13 + k) % 3000 ))
    printf '.box%s { padding: %spx; color: rgb(%s 10 20); }\n' "$idx" "$(( i % 30 + 1 ))" "$(( i % 200 ))" > components/c$idx.module.css
    sed -i "s/c[0-9]* {v}/c${i}_${k} {v}/" components/c$idx.tsx
  done
  for r in 1 2 3 4 5; do curl -s -o /dev/null --max-time 30 "http://localhost:3000/r/$(( (i * 7 + r) % 150 ))"; done
  sample
  sleep 2
done
echo -n "peak next-server RSS (MB): "
awk -F, 'NR>1 && $4>m{m=$4} END{print m}' "$CSV"
