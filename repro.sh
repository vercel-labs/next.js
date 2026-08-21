#!/bin/bash
# Reproduces https://github.com/vercel/next.js/issues/91654 without Docker.
set -e
cd "$(dirname "$0")"
ROOT="$PWD"
PORT="${PORT:-8080}"
rm -rf out

# 1. prune + build the monorepo the way CI/Docker builds do
pnpm install
pnpm turbo prune @repo/test-app
cd out
pnpm install
pnpm turbo build --filter=@repo/test-app
cd "$ROOT"

# 2. emulate the documented Docker copy step (examples/with-docker/Dockerfile):
#    .next/standalone -> ./ and .next/static -> ./<app>/.next/static
#    The target dir must live OUTSIDE this repo, like the image filesystem does.
SIM="$(mktemp -d)"
cp -r out/apps/test-app/.next/standalone/out/. "$SIM"/
mkdir -p "$SIM"/apps/test-app/.next/static
cp -r out/apps/test-app/.next/static/. "$SIM"/apps/test-app/.next/static/
# optional: also copy the new .next/node_modules dir (still fails, the symlinks are broken)
# cp -r out/apps/test-app/.next/node_modules "$SIM"/apps/test-app/.next/node_modules

# 3. run the standalone server
echo "running standalone server in $SIM"
cd "$SIM"
PORT="$PORT" HOSTNAME=127.0.0.1 NODE_ENV=production node apps/test-app/server.js &
SERVER=$!
sleep 8
echo "--- HTTP status (expected 200, actual 500 on next@16.2.0) ---"
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:$PORT/"
kill "$SERVER"
