#!/usr/bin/env bash
# Automated reproduction for https://github.com/vercel/next.js/issues/71440
set -e
cd "$(dirname "$0")"

probe() {
  code=$(curl -s -o /tmp/repro71440.html -w '%{http_code}' http://localhost:3040/posts/abc)
  echo "http=$code noindex=$(grep -c 'content="noindex"' /tmp/repro71440.html) publishedBody=$(grep -c 'is published' /tmp/repro71440.html)"
}

echo '{ "status": "published" }' > state.json
node server.js > backend.log 2>&1 &
BACKEND=$!
sleep 1
npx next build
npx next start -p 3040 > next-server.log 2>&1 &
SERVER=$!
trap 'kill $BACKEND $SERVER 2>/dev/null || true' EXIT
sleep 4

echo "== baseline (post published)"; probe
echo '{ "status": "draft" }' > state.json
echo "== post set to draft -> notFound() gets ISR-cached"; sleep 6
for i in 1 2 3; do probe; sleep 1; done
echo '{ "status": "published" }' > state.json
echo "== post published again"; sleep 6
for i in 1 2 3 4 5 6; do probe; sleep 2; done
echo "== cached entry on disk"
grep -c 'content="noindex"' .next/server/app/posts/abc.html || true
cat .next/server/app/posts/abc.meta; echo
