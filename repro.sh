#!/usr/bin/env bash
# End-to-end reproduction. Run: npm install && ./repro.sh
#
# The trigger is a race: the client has to hang up while the server is still
# streaming the source file into the coalesced internal request. One attempt
# rarely lands, so each phase sweeps a range of abort delays, one cold width
# per attempt (a width that has already been transformed is served from the
# disk cache and never re-enters the code path under test).
set -u

PORT=3000
BASE="http://localhost:$PORT"
OPTIMIZER="node_modules/next/dist/server/image-optimizer.js"
WIDTHS="32 48 64 96 128 256 384 640 750 828 1080 1200 1920 2048"
QUALITIES="50 60 70 75 80 90"
SERVER_PID=""
ORIGIN_PID=""

img() { echo "$BASE/_next/image?url=%2Fbig.jpg&w=$1&q=$2"; }
ext() { echo "$BASE/_next/image?url=http%3A%2F%2F127.0.0.1%3A9999%2Fbig.jpg&w=$1&q=$2"; }

start_server() {
  rm -rf .next/cache/images
  npx next start -p "$PORT" > server.log 2>&1 &
  SERVER_PID=$!
  until curl -s -o /dev/null -m 1 "$BASE/" 2>/dev/null; do
    kill -0 "$SERVER_PID" 2>/dev/null || { echo "server died:"; cat server.log; exit 1; }
    sleep 0.3
  done
}

stop_server() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  wait "$SERVER_PID" 2>/dev/null
  SERVER_PID=""
}

cleanup() {
  stop_server
  [ -n "$ORIGIN_PID" ] && kill "$ORIGIN_PID" 2>/dev/null
  # node_modules is gitignored, so restore the patched file from the backup.
  [ -f "$OPTIMIZER.orig" ] && mv "$OPTIMIZER.orig" "$OPTIMIZER"
}
trap cleanup EXIT

# Aborts a cold transform, then asks for the very same URL as a fresh client.
# Echoes the width if that URL is now permanently unresponsive.
attempt() {
  local url_fn=$1 w=$2 q=$3 delay=$4 url out
  url=$($url_fn "$w" "$q")
  curl -s -o /dev/null -m "$delay" "$url" >/dev/null 2>&1
  out=$(curl -s -o /dev/null -m 6 -w "%{http_code}" "$url")
  if [ "$out" != "200" ]; then
    printf "      w=%-5s q=%-3s abort@%-5ss  -> HUNG (still unresponsive after 6s)\n" "$w" "$q" "$delay"
    echo "$w:$q" >> .hung
  fi
}

sweep() {
  local url_fn=$1 i=0 delay
  rm -f .hung
  for q in $QUALITIES; do
    for w in $WIDTHS; do
      i=$((i + 1))
      delay=$(awk "BEGIN{printf \"%.3f\", 0.005 + ($i % 11) * 0.012}")
      attempt "$url_fn" "$w" "$q" "$delay"
    done
  done
  if [ -f .hung ]; then wc -l < .hung | tr -d ' '; else echo 0; fi
}

[ -f public/big.jpg ] || node scripts/make-image.mjs
[ -d .next ] || npx next build > build.log 2>&1 || { cat build.log; exit 1; }

node scripts/origin.mjs > origin.log 2>&1 &
ORIGIN_PID=$!
sleep 1

echo
echo "=== 1. stock next: sweep 84 cold /public transforms, aborting each mid-flight ==="
start_server
HUNG=$(sweep img | tail -1)
HUNG_WIDTHS=$(tr '\n' ' ' < .hung 2>/dev/null)
echo "   => $HUNG of 84 URLs are now permanently unresponsive: $HUNG_WIDTHS"

echo
echo "=== 2. control: external images (remotePatterns) get the same treatment ==="
EXT_HUNG=$(sweep ext | tail -1)
echo "   => $EXT_HUNG of 84 external URLs unresponsive (this path never touches the client socket)"

echo
echo "=== 3. it is process state, not disk state: restart, retry the dead URLs ==="
DEAD="$HUNG_WIDTHS"
stop_server
start_server
for key in $DEAD; do
  w=${key%%:*}; q=${key##*:}
  printf "      w=%-5s q=%-3s after restart -> %s\n" "$w" "$q" \
    "$(curl -s -o /dev/null -m 6 -w '%{http_code}' "$(img "$w" "$q")")"
done

echo
echo "=== 4. negative control: drop 'socket: _req.socket', same sweep ==="
stop_server
cp "$OPTIMIZER" "$OPTIMIZER.orig"
perl -0pi -e 's/^\s*socket: _req\.socket,\n//m' "$OPTIMIZER"
if grep -q "socket: _req.socket" "$OPTIMIZER"; then echo "   patch failed to apply"; exit 1; fi
start_server
PATCHED_HUNG=$(sweep img | tail -1)
echo "   => $PATCHED_HUNG of 84 URLs unresponsive"

echo
echo "=== summary ==="
echo "   stock next, local images:    $HUNG / 84 permanently hung"
echo "   stock next, external images: $EXT_HUNG / 84"
echo "   patched, local images:       $PATCHED_HUNG / 84"
echo
echo "=== server.log (nothing is logged for any of this) ==="
sed 's/^/      /' server.log
