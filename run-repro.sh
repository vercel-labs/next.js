#!/bin/bash
# Run with: npm install && npm run repro   (needs Linux + `unshare -m`, or run each step in Docker)
#
# Step 1 (build): hostname "backend" does NOT resolve -> mirrors `docker build`, where the
#                 compose network does not exist yet.
# Step 2 (runtime): hostname "backend" DOES resolve and serves JSON -> mirrors the running
#                 compose network.
set -e
cd "$(dirname "$0")"

rm -rf .next
echo "### BUILD (hostname 'backend' unresolvable, like docker build) ###"
API_URL='http://backend:8000/api/v2/' npx next build

echo
echo "### Prerendered HTML baked into the image: ###"
grep -o '<h1>[^<]*</h1><pre>[^<]*</pre>' .next/server/app/index.html

# now make "backend" resolvable, like the docker compose network at runtime
cp /etc/hosts /tmp/hosts-repro && echo "127.0.0.1 backend" >> /tmp/hosts-repro
mount --bind /tmp/hosts-repro /etc/hosts
node backend.js &
sleep 1
curl -s http://backend:8000/api/v2/; echo "  <-- backend IS reachable now"

API_URL='http://backend:8000/api/v2/' node .next/standalone/server.js &
sleep 4
echo "### GET / (static page, prerendered at build time) ###"
curl -s http://127.0.0.1:3000/ | grep -o '<h1>[^<]*</h1><pre>[^<]*</pre>'
echo "### GET /dynamic (same code + export const dynamic = 'force-dynamic') ###"
curl -s http://127.0.0.1:3000/dynamic | grep -o '<h1>[^<]*</h1><pre>[^<]*</pre>'
kill %1 %2 2>/dev/null || true
