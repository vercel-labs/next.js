#!/usr/bin/env bash
# Builds three variants of the same app and measures TBT / JS payload for each:
#   v15      -> next@15.5.7
#   v16off   -> next@16.0.3, cacheComponents disabled
#   v16on    -> next@16.0.3, cacheComponents: true
# Usage: bash run.sh [route]   (route defaults to "/", also try "/heavy")
set -e
ROUTE="${1:-/}"
ROOT="$(cd "$(dirname "$0")" && pwd)"

setup() { # $1 dir, $2 next version
  rm -rf "/tmp/86383-$1"; mkdir -p "/tmp/86383-$1"
  cp -r "$ROOT/app" "$ROOT/next.config.js" "$ROOT/tsconfig.json" "/tmp/86383-$1/"
  ( cd "/tmp/86383-$1" && npm init -y >/dev/null &&
    npm i "next@$2" react@19.2.0 react-dom@19.2.0 typescript@5.9.3 @types/react @types/node --silent )
}

setup v15 15.5.7
setup v16off 16.0.3
setup v16on 16.0.3

( cd /tmp/86383-v15   && npx next build )
( cd /tmp/86383-v16off && npx next build )
( cd /tmp/86383-v16on  && CACHE_COMPONENTS=1 npx next build )

( cd /tmp/86383-v15    && npx next start -p 3015 & )
( cd /tmp/86383-v16off && npx next start -p 3160 & )
( cd /tmp/86383-v16on  && CACHE_COMPONENTS=1 npx next start -p 3161 & )
sleep 8

npm i --silent
npx playwright install chromium
THROTTLE=4 node "$ROOT/measure.js" \
  "v15=http://localhost:3015$ROUTE" \
  "v16off=http://localhost:3160$ROUTE" \
  "v16on=http://localhost:3161$ROUTE"
