#!/usr/bin/env bash
# Reproduction check for https://github.com/vercel/next.js/issues/97000
set -e
npm install
echo "=== VARIANT A: dynamic route (page reads searchParams) ==="
npx next build | tail -n 12
npx next start -p 3000 > server-dynamic.log 2>&1 &
sleep 6
echo -n "GET /unknown -> status "; curl -s -o a.html -w "%{http_code}\n" http://localhost:3000/unknown
echo "h1 tags in body: $(grep -c '<h1' a.html)"; grep -o '<h1[^<]*' a.html || true
kill %1

echo "=== VARIANT B: static route (control, no searchParams) ==="
cp app-static-variant/page.tsx "app/[slug]/page.tsx"
npx next build | tail -n 12
npx next start -p 3000 > server-static.log 2>&1 &
sleep 6
echo -n "GET /unknown -> status "; curl -s -o b.html -w "%{http_code}\n" http://localhost:3000/unknown
echo "h1 tags in body: $(grep -c '<h1' b.html)"; grep -o '<h1[^<]*' b.html || true
kill %1
