#!/bin/bash
set -u
LOG=${LOG:-./logs}
mkdir -p "$LOG"
run() {
  t0=$(date +%s)
  npx next build > "$LOG/build-$1.log" 2>&1
  t1=$(date +%s)
  c=$(grep -a -o "Compiled successfully in [0-9.]*s" "$LOG/build-$1.log" | tail -1)
  echo "$1: $c | total_wall=$((t1-t0))s | cache=$(du -sm .next/cache/turbopack 2>/dev/null | cut -f1)MB"
}
touchN() { i=0; while [ $i -lt $1 ]; do echo "export const drift$RANDOM = $i" >> src/leaf/l$i.ts; i=$((i+1)); done; }
run warm-nochange
touchN 1;   run warm-1file
touchN 200; run warm-200files
touchN 800; run warm-800files
mv .next/cache/turbopack /tmp/tp-cache-bak
run cold-nocache
