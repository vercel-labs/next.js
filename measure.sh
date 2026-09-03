#!/usr/bin/env bash
#
# Measures how much memory the Next.js dev server retains per edit.
#
#   ./measure.sh                          # the leaking case
#   ./measure.sh --disable-source-maps    # the control
#
# It starts `next dev`, renders the page once, then repeatedly inserts a line
# near the top of app/page.tsx and re-renders, sampling RSS of the next-server
# process. A line is inserted at the TOP on purpose: that shifts the line and
# column of every element below it, which is what makes every React
# `fakeFunctionCache` key new on each edit.
#
# The page is restored on exit, including on Ctrl-C.
#
# Env: PORT (default 3333), EDITS (default 12), HEAP_MB (default 3072).

set -u

cd "$(cd "$(dirname "$0")" && pwd)"

PORT="${PORT:-3333}"
EDITS="${EDITS:-12}"
HEAP_MB="${HEAP_MB:-3072}"
PAGE=app/page.tsx
BACKUP=".measure-page-backup"
URL="http://localhost:$PORT/"

:
[ -d node_modules ] || { echo "run 'pnpm install' first"; exit 1; }

if command -v ss >/dev/null && ss -ltn "sport = :$PORT" 2>/dev/null | grep -q LISTEN; then
  echo "port $PORT is already in use; re-run with PORT=<free port>"
  exit 1
fi

cp "$PAGE" "$BACKUP"
CLI=""
cleanup() {
  cp "$BACKUP" "$PAGE" && rm -f "$BACKUP"
  # Kill only the process group this script started, so an unrelated
  # `next dev` elsewhere on the machine is left alone.
  [ -n "$CLI" ] && kill -- "-$CLI" 2>/dev/null
  return 0
}
trap cleanup EXIT INT TERM

export NODE_OPTIONS="--max-old-space-size=$HEAP_MB"

# setsid puts the dev server in its own process group, so $CLI is also its PGID.
setsid node node_modules/next/dist/bin/next dev -p "$PORT" "$@" > "/tmp/measure-$PORT.log" 2>&1 &
CLI=$!

printf 'waiting for the dev server on %s ' "$URL"
code=000
for _ in $(seq 1 120); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 120 "$URL" || true)
  [ "$code" = "200" ] && break
  printf '.'; sleep 1
done
echo
if [ "$code" != "200" ]; then
  echo "the dev server never answered (http=$code); see /tmp/measure-$PORT.log"
  exit 1
fi

# The dev server renames itself to "next-server (vX.Y.Z)". Look for it only
# inside our own process group.
SRV=""
for _ in $(seq 1 10); do
  for pid in $(pgrep -g "$CLI" 2>/dev/null); do
    case "$(ps -o comm= -p "$pid" 2>/dev/null)" in next-server*) SRV=$pid;; esac
  done
  [ -n "$SRV" ] && break
  sleep 1
done
[ -n "$SRV" ] || { echo "could not find the next-server process in group $CLI"; exit 1; }

rss() { ps -o rss= -p "$SRV" 2>/dev/null | tr -d ' '; }
mb()  { awk -v k="${1:-0}" 'BEGIN { if (k == "") k = 0; printf "%d", k / 1024 }'; }

START=$(rss)
echo
echo "next-server pid $SRV, ${HEAP_MB} MB heap cap, $EDITS edits"
printf 'after first render      %6s MB\n' "$(mb "$START")"

for n in $(seq 1 "$EDITS"); do
  if ! kill -0 "$SRV" 2>/dev/null; then
    echo "the dev server died at edit $n (out of memory); see /tmp/measure-$PORT.log"
    exit 1
  fi
  sed -i "1a // edit $n" "$PAGE"
  sleep 1.2
  curl -s -o /dev/null --max-time 120 "$URL" || true
  printf 'after %2d edit(s)        %6s MB\n' "$n" "$(mb "$(rss)")"
done

END=$(rss)
echo
echo "grew $(( $(mb "$END") - $(mb "$START") )) MB over $EDITS edits" \
     "(~$(( ( $(mb "$END") - $(mb "$START") ) / EDITS )) MB per edit)"
