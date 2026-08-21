#!/usr/bin/env bash
# Reproduces: aborted client request permanently hangs a Next.js image
# transform URL under `next start` (request coalescing never releases).
#
# Usage:  npm install && npm run build && ./repro.sh
set -u

PORT="${PORT:-3111}"
BASE="http://localhost:$PORT"
POISONED="$BASE/_next/image?url=%2Fbig.jpg&w=640&q=75"
CONTROL="$BASE/_next/image?url=%2Fbig.jpg&w=828&q=75"

# 0. Generate a large source image if missing (noise compresses badly, so
#    this yields a ~12 MB JPEG; a big source widens the abort window).
if [ ! -f public/big.jpg ]; then
  echo "--- generating public/big.jpg (~12 MB noise JPEG) ---"
  mkdir -p public && node gen-image.js
fi

# 1. Fresh start: clear the on-disk image cache so the transform is COLD,
#    then boot next start.
rm -rf .next/cache/images
./node_modules/.bin/next start -p "$PORT" > server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT
sleep 3
curl -sf -o /dev/null "$BASE/" || { echo "server failed to start"; exit 1; }
echo "--- next start up on :$PORT (pid $SERVER_PID) ---"

# 2. Abort a COLD transform request mid-flight (20 ms client timeout).
echo "--- step 1: abort cold transform mid-flight: curl -m 0.02 $POISONED ---"
curl -s -m 0.02 -o /dev/null "$POISONED"
echo "    curl exit: $? (28 = client aborted, expected)"

# 3. Request the SAME transform URL again with a generous timeout.
#    EXPECTED: 200 in well under a second (the control below shows the
#    normal cold-transform time). ACTUAL: hangs until the 15 s client
#    timeout; repeats forever until the server process is restarted.
echo "--- step 2: re-request the same URL with a 15 s timeout ---"
curl -s -o /dev/null -w "    %{http_code} in %{time_total}s\n" -m 15 "$POISONED"
echo "    curl exit: $? (28 = HANG reproduced)"

# 4. Control: a different width of the same source image works fine.
echo "--- step 3: control, same image at w=828 ---"
curl -s -o /dev/null -w "    %{http_code} in %{time_total}s\n" -m 15 "$CONTROL"
echo "    curl exit: $? (0 = fine)"

# 5. Nothing was logged.
echo "--- server.log (note: no error, no warning, nothing) ---"
sed 's/^/    /' server.log

# 6. Restart the server: the same URL now serves instantly.
echo "--- step 4: restart next start, probe the poisoned URL again ---"
kill "$SERVER_PID"; sleep 1
./node_modules/.bin/next start -p "$PORT" >> server.log 2>&1 &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "    after restart: %{http_code} in %{time_total}s\n" -m 15 "$POISONED"
