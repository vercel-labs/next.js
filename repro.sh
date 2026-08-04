#!/usr/bin/env bash
# Reproduction for vercel/next.js#96649
# Runs the two skill instructions verbatim against a src/app project on port 3010.
set -u
cd "$(dirname "$0")"

[ -d node_modules ] || npm install --no-audit --no-fund

echo "=== project layout ==="
find src/app -name '*.tsx' | sort
echo

echo "=== A. next-cache-components-adoption: codemod command as written in SKILL.md ==="
npx --yes @next/codemod@latest cache-components-instant-false ./app --force 2>&1 | tail -8
echo "codemod exit=${PIPESTATUS[0]}  (expected: exits 0, reports '0 ok' — silent no-op on src/app)"
echo

echo "=== A2. completion checks as written in SKILL.md ==="
grep -n "export const instant" app/layout.* ; echo "  -> exit=$? (no stdout: 'root layout opt-out' check passes vacuously)"
grep -rln "TODO: Cache Components adoption" app ; echo "  -> exit=$? (no stdout: 'no TODOs left' check passes vacuously)"
echo

echo "=== A3. reality: the app is still blocking, migration touched nothing ==="
npx next build 2>&1 | grep -E "blocking-prerender|Error: Route" | head -5
echo

echo "=== B. next-dev-loop preflight probe order ==="
npm run dev > /tmp/next-dev-3010.log 2>&1 &
DEV=$!
for _ in $(seq 1 60); do grep -q "Ready in" /tmp/next-dev-3010.log && break; sleep 1; done
grep -E "Local:|Ready in" /tmp/next-dev-3010.log
REQ='{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
echo "-- preflight step 2 probes the default port before the NEXT_MCP_URL gotcha is read --"
curl -s -S -m 10 -X POST http://localhost:3000/_next/mcp -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' -d "$REQ" ; echo "  -> curl exit=$? (skill says: refuse)"
echo "-- same probe on the real port 3010 --"
curl -s -m 10 -X POST http://localhost:3010/_next/mcp -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' -d "$REQ" | sed -n 's/^data: //p' | head -c 200 ; echo
kill $DEV 2>/dev/null; pkill -f "next dev" 2>/dev/null
