#!/usr/bin/env bash
# Reproduces: CSS module used only by app/not-found.tsx is emitted into a CSS
# chunk that is preloaded on every unrelated route (/dashboard, /dashboard/users).
set -e
PORT=${PORT:-4100}
./node_modules/.bin/next build
./node_modules/.bin/next start -p "$PORT" &
SERVER=$!
sleep 8
echo "--- CSS links in /dashboard HTML ---"
curl -s "http://localhost:$PORT/dashboard" | grep -o '<link rel="\(stylesheet\|preload\)"[^>]*\.css[^>]*>'
echo "--- chunks containing Button.module.css rules (.button uses inline-flex) ---"
grep -rl 'inline-flex' .next/static/chunks/*.css || true
kill $SERVER
