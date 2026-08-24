#!/usr/bin/env bash
# Docker-less variant of the reporter's harness (vercel/next.js#97800).
# Run it directly on a host/container that already has 2 CPUs, 4 GB RAM and no swap.
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

version="${1:-canary}"
routes="${REPRO_ROUTES:-100}"
components="${REPRO_COMPONENTS_PER_ROUTE:-120}"
rows="${REPRO_ROWS_PER_COMPONENT:-96}"
timeout_seconds="${BUILD_TIMEOUT_SECONDS:-180}"
out="${root}/results/${version}-${routes}x${components}"
mkdir -p "$out"

export NEXT_TELEMETRY_DISABLED=1

echo "==> installing next@${version}"
npm install --no-save --no-audit --no-fund "next@${version}" >/dev/null
node -e 'console.log("next", require("next/package.json").version)'
echo "==> host: $(nproc) cpus, $(awk "/MemTotal/{printf \"%d MiB\", \$2/1024}" /proc/meminfo), swap $(awk "/SwapTotal/{printf \"%d MiB\", \$2/1024}" /proc/meminfo)"

REPRO_ROUTES="$routes" REPRO_COMPONENTS_PER_ROUTE="$components" \
  REPRO_ROWS_PER_COMPONENT="$rows" node scripts/generate.mjs
rm -rf .next

( while true; do
    echo "$(date +%s),$(ps -eo rss --no-headers | awk '{s+=$1} END {print s*1024}'),$(awk '/MemAvailable/{print $2*1024}' /proc/meminfo)"
    sleep 1
  done ) > "$out/memory.csv" &
sampler=$!
trap 'kill "$sampler" 2>/dev/null' EXIT

start=$(date +%s)
timeout --signal=TERM --kill-after=10s "${timeout_seconds}s" \
  node ./node_modules/next/dist/bin/next build 2>&1 | tee "$out/build.log"
status=${PIPESTATUS[0]}
duration=$(( $(date +%s) - start ))

kill "$sampler" 2>/dev/null
peak=$(awk -F, 'BEGIN{p=0} $2>p{p=$2} END{print int(p/1048576)}' "$out/memory.csv")
starved=$(awk -F, '$3 < 104857600 {c++} END{print c+0}' "$out/memory.csv")

printf '\nnext: %s\nroutes: %s\nclient modules: %s\nduration: %ss\npeak host RSS: %s MiB\nsamples with <100 MiB available: %s\nexit status: %s\n' \
  "$version" "$routes" "$((routes * components))" "$duration" "$peak" "$starved" "$status"
exit "$status"
