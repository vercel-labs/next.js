#!/usr/bin/env bash
# Headless reproduction of https://github.com/vercel/next.js/issues/62008
#
# It does what the VS Code JavaScript debugger (vscode-js-debug) does:
#  1. launch `next dev` with NODE_OPTIONS=--inspect
#  2. attach to every node inspector target (CLI process + Next.js router server)
#  3. read the source maps of every parsed script
#  4. resolve `app/page.tsx` / `app/api/health/route.ts` on disk from the source
#     map `sources` and set a breakpoint on that source line
#  5. request the route and report whether the breakpoint was bound and hit
#
# Env: PORT (http), INSPECT_BASE (first inspector port), FILE, LINE, URL, DEV_ARGS
set -u
PORT=${PORT:-3000}
INSPECT_BASE=${INSPECT_BASE:-9229}
FILE=${FILE:-app/api/health/route.ts}
LINE=${LINE:-2}
URL=${URL:-http://localhost:$PORT/api/health}
mkdir -p logs
node -e "console.log('next version:', require('next/package.json').version)"

# `next dev` starts several node processes; each one inherits --inspect and falls
# back to the next free port, so a small port range has to be free.
node -e '
const net = require("net");
const base = Number(process.argv[1]);
(async () => {
  for (let p = base; p < base + 4; p++) {
    await new Promise((res) => {
      const s = net.createServer();
      s.once("error", () => {
        console.error("inspector port " + p + " is already in use - free it or set INSPECT_BASE=<port>");
        process.exit(1);
      });
      s.listen(p, "127.0.0.1", () => s.close(res));
    });
  }
})();
' "$INSPECT_BASE" || exit 1

NODE_OPTIONS="--inspect=$INSPECT_BASE" setsid npx next dev ${DEV_ARGS:-} -p "$PORT" > logs/next-dev.log 2>&1 &
NEXT_PID=$!
for i in $(seq 1 60); do
  grep -q "Ready in" logs/next-dev.log && break
  if grep -q "EADDRINUSE" logs/next-dev.log; then
    echo "http port $PORT is busy, set PORT=<port>"
    kill $NEXT_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done
sed -n '1,12p' logs/next-dev.log

echo "probing inspector ports $INSPECT_BASE-$((INSPECT_BASE + 3))"
WEBROOT="$PWD" node probe/debug-probe.mjs "$PWD/$FILE" "$LINE" "$INSPECT_BASE-$((INSPECT_BASE + 3))" "$URL"

kill -- -$NEXT_PID 2>/dev/null   # kill next dev and its child server processes
exit 0
