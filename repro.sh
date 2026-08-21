#!/usr/bin/env bash
set -euo pipefail
MODE="${MODE:-turbopack}"
PORT="${PORT:-3000}"
SRC="$(cd "$(dirname "$0")" && pwd)"
MNT=/tmp/repro-mnt
mkdir -p "$MNT"
mountpoint -q "$MNT" || bindfs --no-allow-other "$SRC" "$MNT"

printf 'export default function Page() {\n  return <h1>VERSION_1</h1>\n}\n' > "$SRC/app/page.tsx"

cd "$MNT"
if [ "$MODE" = webpack ]; then
  WATCHPACK_POLLING=true setsid nohup npx next dev --webpack -p "$PORT" > /tmp/repro-$MODE.log 2>&1 < /dev/null &
else
  setsid nohup npx next dev -p "$PORT" > /tmp/repro-$MODE.log 2>&1 < /dev/null &
fi

for _ in $(seq 40); do curl -sf "http://localhost:$PORT" >/dev/null && break; sleep 1; done
echo "initial:  $(curl -s http://localhost:$PORT | grep -o 'VERSION_[0-9]' | head -1)"

# "host-side" edit: write through the backing directory, not the FUSE mount
printf 'export default function Page() {\n  return <h1>VERSION_2</h1>\n}\n' > "$SRC/app/page.tsx"
sleep 20
echo "after edit: $(curl -s http://localhost:$PORT | grep -o 'VERSION_[0-9]' | head -1) (expected VERSION_2)"
tail -5 /tmp/repro-$MODE.log
pkill -f next-server || true
