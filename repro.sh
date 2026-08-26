#!/usr/bin/env bash
# Docker-free reproduction: emulates the docker build context (.dockerignore drops .env)
# and the standalone runner image, then curls /api/env.
# Usage: ./repro.sh          -> docker-equivalent context (no .env)  => nulls
#        ./repro.sh with-env -> .env kept in context                 => values
set -e
MODE=${1:-docker}
ROOT=$(cd "$(dirname "$0")" && pwd)
WORK=$(mktemp -d)
cp -r "$ROOT"/app "$ROOT"/package.json "$ROOT"/next.config.js "$WORK"/
[ "$MODE" = "with-env" ] && cp "$ROOT"/.env "$WORK"/ # .dockerignore excludes .env in docker mode
cd "$WORK"
npm install --no-audit --no-fund >/dev/null
NODE_ENV=production npx next build >/dev/null
RUN="$WORK/run"; mkdir -p "$RUN/.next"
cp -r "$WORK"/.next/standalone/. "$RUN"/
cp -r "$WORK"/.next/static "$RUN"/.next/static
cd "$RUN"
echo "standalone output contains .env? -> $(ls -a "$RUN" | grep -c '^\.env$')"
NODE_ENV=production PORT=3099 node server.js >"$WORK"/server.log 2>&1 &
SRV=$!
sleep 5
echo "mode=$MODE  GET /api/env ->"
curl -s --max-time 5 localhost:3099/api/env; echo
kill $SRV
