#!/usr/bin/env bash
# Docker-free harness: generates the fixture, runs `next build`, and samples
# memory once per second. Intended to run on a 2 CPU / 4 GB Linux machine
# (or inside such a cgroup), which is where the failure appears.
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

label="${LABEL:-run}"
timeout_seconds="${BUILD_TIMEOUT_SECONDS:-180}"
mkdir -p results

export REPRO_ROUTES="${REPRO_ROUTES:-100}"
export REPRO_COMPONENTS_PER_ROUTE="${REPRO_COMPONENTS_PER_ROUTE:-120}"
export REPRO_ROWS_PER_COMPONENT="${REPRO_ROWS_PER_COMPONENT:-96}"

node scripts/generate.mjs
rm -rf .next

mem_csv="results/${label}.mem.csv"
build_log="results/${label}.log"
: > "$mem_csv"

(
  while true; do
    echo "$(date +%s),$(cat /sys/fs/cgroup/memory.current 2>/dev/null || echo 0),$(awk '/MemAvailable/{print $2}' /proc/meminfo)"
    sleep 1
  done
) > "$mem_csv" &
sampler=$!

timeout --signal=TERM --kill-after=10s "${timeout_seconds}s" \
  ./node_modules/.bin/next build > "$build_log" 2>&1
status=$?
kill "$sampler" 2>/dev/null

awk -F, -v s="$status" '
  NR==1 { start = $1 }
  { end = $1; if ($2 > peak) peak = $2; if ($3 < min_avail || NR == 1) min_avail = $3 }
  END {
    printf "exit status:        %s\n", s
    printf "elapsed:            %d s\n", end - start
    printf "peak cgroup memory: %d MiB\n", peak / 1048576
    printf "min MemAvailable:   %d MiB\n", min_avail / 1024
  }
' "$mem_csv"

echo "build log: $build_log"
tail -3 "$build_log"
exit "$status"
