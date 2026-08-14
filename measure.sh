#!/bin/bash
# Measures RSS of the whole `next dev --turbopack` process tree across batches of
# serial GET / requests. Usage: bash measure.sh [requests-per-batch] [batches]
set -u
N=${1:-250}; B=${2:-6}; PORT=${PORT:-3000}
rm -rf .next
npx next dev --turbopack --port "$PORT" > dev-server.log 2>&1 &
ROOT=$!
tree_pids() {
  local f="$ROOT" all="$ROOT" n
  while [ -n "$f" ]; do
    n=$(ps -o pid= --ppid "$(echo $f | tr ' ' ,)" 2>/dev/null | tr '\n' ' ')
    f=$(echo $n); [ -n "$f" ] && all="$all $f"
  done
  echo $all
}
tree_rss() {
  local sum=0 r
  for p in $(tree_pids); do
    r=$(awk '/^VmRSS/{print $2}' /proc/$p/status 2>/dev/null); sum=$((sum + ${r:-0}))
  done
  echo $sum
}
for i in $(seq 60); do curl -sf -o /dev/null "http://127.0.0.1:$PORT/" && break; sleep 2; done
sleep 5
echo "baseline_rss_kb=$(tree_rss)"
for b in $(seq $B); do
  start=$(tree_rss)
  for i in $(seq $N); do curl -s -o /dev/null "http://127.0.0.1:$PORT/"; done
  sleep 15   # let idle GC settle
  end=$(tree_rss)
  echo "batch=$b requests=$N rss_start_kb=$start rss_end_kb=$end delta_kb=$((end-start))"
done
kill -9 $(tree_pids) 2>/dev/null
