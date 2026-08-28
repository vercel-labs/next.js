#!/usr/bin/env bash
# Reproduction harness for vercel/next.js#98023.
#
#   ./scripts/run.sh            # ancestor package.json only
#   ./scripts/run.sh lockfile   # also put a lockfile in the ancestor, which
#                               # makes Next infer the ancestor as workspace root
#
# Starts `next dev` (Turbopack) in parent/app, requests "/", and samples the
# number of live PostCSS worker processes plus total RSS for 30s.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/parent/app"
PORT="${PORT:-3000}"
MODE="${1:-plain}"
LOG="$ROOT/next-dev.log"
MON="$ROOT/monitor.log"

rm -f "$LOG" "$MON" "$ROOT/parent/package-lock.json"
[ "$MODE" = "lockfile" ] && echo '{}' > "$ROOT/parent/package-lock.json"

cd "$APP"
[ -d node_modules ] || npm install --no-audit --no-fund
rm -rf .next

setsid node node_modules/.bin/next dev -p "$PORT" > "$LOG" 2>&1 < /dev/null &
DEV=$!
trap 'kill -9 $DEV 2>/dev/null; pkill -9 -f "dev/build/postcss" 2>/dev/null' EXIT

for _ in $(seq 1 60); do grep -q "Ready" "$LOG" && break; sleep 1; done
echo "--- dev server up, requesting / ---"
curl -s -o /dev/null -w "GET / -> %{http_code}\n" "http://localhost:$PORT/"

PEAK=0
for _ in $(seq 1 60); do
  n=$(pgrep -fc "dev/build/postcss" 2>/dev/null); n=${n:-0}
  rss=$(ps -eo rss= | awk '{s+=$1} END {print int(s/1024)}')
  [ "$n" -gt "$PEAK" ] && PEAK=$n
  echo "procs=$n totalRSS_MB=$rss" >> "$MON"
  # safety valve: the issue reports unbounded growth
  if [ "$n" -gt 200 ]; then echo "!! runaway workers: $n"; break; fi
  sleep 0.5
done

echo "--- peak postcss worker processes: $PEAK (nproc=$(nproc)) ---"
grep -E "POSTCSS_WORKER_CWD|RESOLVE_TAILWIND|inferred your workspace|Can't resolve" "$LOG" || true
