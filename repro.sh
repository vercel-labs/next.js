#!/bin/bash
# Usage: npm install && npm run build && (npm start &) && ./repro.sh
set -u
p() { curl -s -m 15 -o /dev/null -w "GET /test -> %{http_code} %{redirect_url}\n" http://localhost:3000/test; }
echo "before enabling redirect:"; p
curl -s http://localhost:3000/api/enable; echo
echo "after enabling redirect (revalidate: 1):"
for i in 1 2 3 4 5; do p; sleep 2; done
echo "expected: 307 -> http://localhost:3000/   actual with cacheMaxMemorySize: 50 -> 200 forever"
