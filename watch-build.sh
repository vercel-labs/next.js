#!/usr/bin/env bash
# Runs `next build` in $1, logging to $2, and watches process-tree CPU.
# Declares a HANG if the whole tree stays at ~0% CPU for $STALL_SECS while the
# build is still running.
set -u
DIR="$1"; LOG="$2"; LIMIT="${3:-1800}"; STALL_SECS="${STALL_SECS:-90}"
cd "$DIR" || exit 2
: > "$LOG"
npx next build >>"$LOG" 2>&1 &
BUILD=$!
start=$(date +%s); idle=0
while kill -0 $BUILD 2>/dev/null; do
  sleep 5
  # sum %CPU of the whole tree via /proc based instantaneous sampling
  cpu=$(ps -eo pid,ppid,pcpu,comm --no-headers | awk '$4 ~ /node|next|nextjs/ {s+=$3} END {printf "%.1f", s+0}')
  now=$(date +%s); el=$((now-start))
  echo "[watch ${el}s] tree_cpu=${cpu}%"
  if awk "BEGIN{exit !($cpu < 3.0)}"; then idle=$((idle+5)); else idle=0; fi
  if [ "$idle" -ge "$STALL_SECS" ]; then
    echo "[watch] HANG: tree CPU ~0% for ${idle}s at ${el}s elapsed"
    ps -eo pid,ppid,pcpu,rss,stat,comm --no-headers | grep -E "node|next" | head -20
    kill -QUIT $BUILD 2>/dev/null
    sleep 3; kill -9 $BUILD 2>/dev/null
    echo "HANG_DETECTED"
    exit 42
  fi
  if [ "$el" -ge "$LIMIT" ]; then
    echo "[watch] TIMEOUT at ${el}s (cpu was busy)"; kill -9 $BUILD 2>/dev/null; exit 43
  fi
done
wait $BUILD; rc=$?
echo "[watch] build exited rc=$rc after $(( $(date +%s)-start ))s"
exit $rc
