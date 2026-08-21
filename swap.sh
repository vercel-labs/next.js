#!/usr/bin/env bash
# Deterministic reproduction of the *failure* (not just the two variants).
#
# 1. build with postcss.config.js removed -> saves the webpack-loaders variant of
#    .next/build/chunks/[turbopack]_runtime.js (no `contextPrototype.a = asyncModule`)
# 2. build normally (postcss + scss)      -> saves the postcss variant, keeps all chunks
# 3. run the real emitted postcss pool entry against each runtime, with a dummy IPC server
#    on the port the pool entry expects as argv[2].
#
# Result: the postcss pool entry works with its own runtime and dies with
# `TypeError: __turbopack_context__.a is not a function` against the webpack-loaders
# runtime -- exactly the build error, i.e. what happens when that pool writes last.
set -u
RT='.next/build/chunks/[turbopack]_runtime.js'
POOL=$(ls .next/build/chunks 2>/dev/null | grep '^pool_entry-.*postcss.*\._\.js$' | head -1)

mv postcss.config.js /tmp/pc.off; rm -rf .next; npm run build >/dev/null 2>&1
cp "$RT" /tmp/rt-webpack-loaders.js
mv /tmp/pc.off postcss.config.js; rm -rf .next; npm run build >/dev/null 2>&1
cp "$RT" /tmp/rt-postcss.js
POOL=$(ls .next/build/chunks | grep '^pool_entry-.*postcss.*\._\.js$' | head -1)
printf 'webpack-loaders runtime: %s B, asyncModule x%s\n' "$(wc -c </tmp/rt-webpack-loaders.js)" "$(grep -c asyncModule /tmp/rt-webpack-loaders.js)"
printf 'postcss runtime:         %s B, asyncModule x%s\n' "$(wc -c </tmp/rt-postcss.js)" "$(grep -c asyncModule /tmp/rt-postcss.js)"

cat > /tmp/ipc-server.js <<'EOF'
const net = require('net');
const s = net.createServer(c => c.on('data', d => process.stdout.write(d.toString().replace(/[^\x20-\x7e]/g, ''))));
s.listen(0, '127.0.0.1', () => require('fs').writeFileSync('/tmp/ipc-port', String(s.address().port)));
EOF
node /tmp/ipc-server.js > /tmp/ipc.out 2>&1 &
SRV=$!; sleep 1; PORT=$(cat /tmp/ipc-port)

probe() { # $1 = runtime to install, $2 = label
  cp "$1" "$RT"; : > /tmp/ipc.out
  echo "== $2 =="
  timeout 25 node ".next/build/chunks/$POOL" "$PORT" >/dev/null 2>&1
  sleep 1
  if grep -q '__turbopack_context__.a is not a function' /tmp/ipc.out; then
    echo "  FAIL: TypeError: __turbopack_context__.a is not a function"
    grep -o '"lineNumber":[0-9]*' /tmp/ipc.out | head -1 | sed 's/^/  /'
  else
    echo "  ok: config loader evaluated (no .a TypeError)"
  fi
}
probe /tmp/rt-postcss.js "postcss runtime in place (pool wrote last -> build passes)"
probe /tmp/rt-webpack-loaders.js "webpack-loaders runtime in place (pool wrote last -> build fails)"
kill $SRV
