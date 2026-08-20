#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/71622
# Emulates a Docker Desktop bind mount: content changes are visible through the
# mount, but no inotify events are delivered for them.
# Requires: Linux, root (for `mount -t overlay`), Node 20+.
set -euo pipefail
cd "$(dirname "$0")"
ROOT="$PWD"
MODE="${MODE:-turbopack}"
PORT="${PORT:-3000}"
mkdir -p logs
LOG="$ROOT/logs/$MODE-dev.log"

if [ ! -d app/node_modules ]; then
  (cd app && npm install --no-audit --fund=false)
fi

# reset marker + mount (a fresh mount is required: once a path is written through
# the mount it is copied up and lower-dir edits stop being visible)
printf 'export default function Page() {\n  return <h1>MARKER_V1</h1>\n}\n' > app/app/page.tsx
while mount | grep -q "$ROOT/mnt "; do umount -l "$ROOT/mnt" || break; done
rm -rf up work && mkdir -p up work mnt
mount -t overlay overlay -o lowerdir="$ROOT/app",upperdir="$ROOT/up",workdir="$ROOT/work" "$ROOT/mnt"

# prove that the mount delivers no inotify events for "host" edits
cat > logs/watchcheck.js <<'EOF'
const fs = require('fs')
fs.watch(process.argv[2], { recursive: true }, (e, f) => console.log('inotify EVENT', e, f))
setInterval(() => {}, 1000)
EOF
node logs/watchcheck.js "$ROOT/mnt/app" > logs/inotify-watch.log 2>&1 &
WATCHER=$!

case "$MODE" in
  webpack)            ARGS="--webpack";  ENVS="" ;;
  webpack-polling)    ARGS="--webpack";  ENVS="WATCHPACK_POLLING=true" ;;
  turbopack-polling)  ARGS="";           ENVS="WATCHPACK_POLLING=true" ;;
  *)                  ARGS="";           ENVS="" ;;
esac

cd mnt
env $ENVS npx next dev $ARGS -p "$PORT" > "$LOG" 2>&1 &
DEV=$!
cd "$ROOT"
trap 'kill $DEV $WATCHER 2>/dev/null || true; umount -l "$ROOT/mnt" 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do curl -sf -m 5 "http://localhost:$PORT" >/dev/null && break; sleep 1; done
echo "before edit: $(curl -s -m 20 "http://localhost:$PORT" | grep -o 'MARKER_V[0-9]' | head -1)"

# the "host" edit: written to the lowerdir, visible through the mount, no inotify event
printf 'export default function Page() {\n  return <h1>MARKER_V2</h1>\n}\n' > app/app/page.tsx
echo "file seen inside the mount: $(grep -o 'MARKER_V[0-9]' mnt/app/page.tsx)"
sleep 20
echo "after edit:  $(curl -s -m 20 "http://localhost:$PORT" | grep -o 'MARKER_V[0-9]' | head -1)"
echo "inotify events observed: $(wc -l < logs/inotify-watch.log)"
echo "dev server log: $LOG"
