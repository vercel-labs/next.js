#!/usr/bin/env bash
# Reproduces vercel/next.js#47085: middleware `matcher` never matches the
# basePath root route (`/<basePath>`).
set -uo pipefail

check() {
  local port=$1 label=$2 path=$3 hdr
  hdr=$(curl -s -D - -o /dev/null "http://localhost:$port$path" | tr -d '\r' | grep -i '^x-middleware-ran' || true)
  if [ -z "$hdr" ]; then
    echo "  $label $path -> middleware DID NOT run"
  else
    echo "  $label $path -> middleware ran ($hdr)"
  fi
}

run() {
  local label=$1 port=$2 ready=$3; shift 3
  npm run build >"/tmp/build-$label.log" 2>&1 || { echo "build failed, see /tmp/build-$label.log"; exit 1; }
  setsid npx next start -p "$port" >"/tmp/next-$label.log" 2>&1 &
  local pid=$!
  local pgid; pgid=$(ps -o pgid= -p $pid | tr -d ' ')
  for _ in $(seq 1 60); do curl -sf -o /dev/null "http://localhost:$port$ready" && break; sleep 1; done
  for p in "$@"; do check "$port" "$label" "$p"; done
  kill -TERM -"$pgid" 2>/dev/null
  sleep 1
}

echo "== baseline: no basePath (expected: middleware runs on / and /about)"
printf 'module.exports = {};\n' > next.config.js
run nobase 3011 / / /about

echo "== basePath: '/withbase' (BUG: middleware does not run on /withbase)"
printf "module.exports = { basePath: '/withbase' };\n" > next.config.js
run withbase 3012 /withbase /withbase /withbase/about

echo "== generated matcher regexp (basePath build)"
node -e "const m=require('./.next/server/middleware-manifest.json');console.log(JSON.stringify(Object.values(m.middleware)[0].matchers,null,2))"
