#!/usr/bin/env bash
# Demo for https://github.com/vercel/next.js/issues/63255
#
# Windows (the platform the issue was filed on) has a case-insensitive
# filesystem, so `cd c:\users\me\myapp` succeeds even when the real directory is
# `C:\Users\Me\MyApp`. Next.js has a guard for that in
# packages/next/src/lib/get-project-dir.ts: it compares the resolved dir with
# realpathSync(dir) and warns "Invalid casing detected for project dir".
#
# That guard imports realpathSync from packages/next/src/lib/realpath.ts, which
# is `fs.realpathSync` on win32 and `fs.realpathSync.native` everywhere else.
# The plain JS fs.realpathSync does NOT canonicalise casing, so on Windows the
# comparison always succeeds and the wrong-cased project dir is kept.
#
# This script shows the working (non-Windows) code path on Linux: the
# wrong-cased dir is emulated with a symlink whose name differs from the real
# directory only in case. With realpathSync.native the guard fires and Next
# normalises the dir, so the dev server compiles cleanly.
set -euo pipefail

PORT="${PORT:-3020}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
LOG="$WORK/next-dev.log"

mkdir -p "$WORK/MyApp"
cp -r "$ROOT/app" "$ROOT/package.json" "$WORK/MyApp/"
[ -d "$ROOT/node_modules" ] && cp -r "$ROOT/node_modules" "$WORK/MyApp/"
ln -s MyApp "$WORK/myapp"

echo "real dir : $WORK/MyApp"
echo "used dir : $WORK/myapp (differs only in casing)"

node "$WORK/MyApp/node_modules/next/dist/bin/next" dev "$WORK/myapp" -p "$PORT" \
  >"$LOG" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  sleep 1
  grep -q "Ready in" "$LOG" && break
done
curl -s -o /dev/null "http://localhost:$PORT/" || true
sleep 5

echo "----- next dev output -----"
cat "$LOG"
echo "---------------------------"

if grep -q "Invalid casing detected for project dir" "$LOG"; then
  echo "GUARD FIRED (realpathSync.native path) - dir normalised, build is clean"
else
  echo "GUARD DID NOT FIRE - wrong-cased project dir kept (this is what happens on Windows)"
fi
