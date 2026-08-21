#!/usr/bin/env bash
# Reproduction harness for https://github.com/vercel/next.js/issues/88736
# "Can't start dev project in the vscode's js debug terminal with bun"
#
# It reproduces the VS Code "JavaScript Debug Terminal" environment without VS Code:
# a standalone vscode-js-debug DAP server is driven by harness/dap-client.mjs, which
# answers the reverse `runInTerminal` request by spawning `bun run dev` with exactly the
# env js-debug injects (NODE_OPTIONS=--require <bootloader.js>, VSCODE_INSPECTOR_OPTIONS).
#
# Requirements: bun (1.3.x), node, curl. Usage: ./run.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
JS_DEBUG_VERSION="${JS_DEBUG_VERSION:-1.117.0}"
BUN="${BUN:-$(command -v bun)}"
# Set SPACED_PATH=1 to place the bootloader under a path containing spaces, like the
# default macOS install ("/Applications/Visual Studio Code.app/...").
SPACED_PATH="${SPACED_PATH:-0}"

cd "$here"
if [ ! -d js-debug ]; then
  curl -sL -o js-debug.tar.gz "https://github.com/microsoft/vscode-js-debug/releases/download/v${JS_DEBUG_VERSION}/js-debug-dap-v${JS_DEBUG_VERSION}.tar.gz"
  tar xzf js-debug.tar.gz
fi
if [ "$SPACED_PATH" = "1" ]; then
  target="$here/Visual Studio Code.app/Contents/Resources/app/extensions/ms-vscode.js-debug"
  mkdir -p "$target"; cp -r js-debug/src "$target/"
  export JS_DEBUG_DIR="$target"
fi

cd app
[ -d node_modules ] || "$BUN" install

cd "$here"
node "${JS_DEBUG_DIR:-$here/js-debug}/src/dapDebugServer.js" 4711 > dap-server.log 2>&1 &
server=$!
sleep 2
node harness/dap-client.mjs "$BUN run dev" "$here/app" "$here/next-dev.log" > dap-client.log 2>&1 &
client=$!
sleep 25
echo "--- next dev output (next-dev.log) ---"; cat next-dev.log || true
echo "--- HTTP status for http://localhost:3000/ ---"
curl -s -m 5 -o /dev/null -w "%{http_code}\n" http://localhost:3000/ || echo "no response (hang)"
kill $client $server 2>/dev/null || true
pkill -f 'start-server.js' 2>/dev/null || true
