#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/61228
#   "Running `next build` breaks the running `next dev` server"
#
#   npm install && ./repro.sh
#
# Exits 0 and prints "RESULT: REPRODUCED ..." when the running dev server starts
# serving HTTP 500 "Cannot find module './<n>.js'" because `next build` reused
# and overwrote the same .next directory.
set -u
PORT=${PORT:-3000}
LOGDIR=${LOGDIR:-./logs}
mkdir -p "$LOGDIR"
rm -rf .next
echo "== next $(node -e "console.log(require('next/package.json').version)") / node $(node -v)"

# 1. start the dev server (as a developer would, in one shell)
npx next dev --port "$PORT" > "$LOGDIR/dev.log" 2>&1 &
DEV=$!
trap 'kill -9 $DEV 2>/dev/null' EXIT
for i in $(seq 1 90); do curl -sf -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done

# 2. the app renders fine
for p in / /about; do
  echo "before build: $p -> $(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$p")"
done

FAIL=""
check() {
  for p in / /about; do
    C=$(curl -s -o /tmp/repro61228.html -w '%{http_code}' "http://localhost:$PORT$p")
    E=$(grep -oE "Cannot find module &#x27;\./[0-9]+\.js&#x27;|Cannot find module '\./[0-9]+\.js'|ENOENT[^\"<]{0,60}" /tmp/repro61228.html | head -1)
    echo "$1: $p -> $C ${E:-}"
    if [ "$C" != "200" ] || [ -n "$E" ]; then FAIL="${E:-HTTP $C on $p}"; fi
  done
}

# 3. run `next build` in another shell -- same .next directory
echo "== next build (dev server still running)"
npx next build > "$LOGDIR/build.log" 2>&1 &
B=$!
while kill -0 $B 2>/dev/null; do check "during build"; sleep 0.5; done
wait $B; echo "build exit=$?"

# 4. refresh the page: the dev server stays broken until it is restarted
for i in $(seq 1 8); do check "after build"; sleep 1; done

if [ -n "$FAIL" ]; then echo "RESULT: REPRODUCED -> $FAIL"; else echo "RESULT: NOT REPRODUCED"; fi
exit 0
