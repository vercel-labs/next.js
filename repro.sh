#!/bin/sh
set -e
for p in /api/test /api/route-handler /api/next-response /api/cookies-api; do
  echo "=== $p"
  curl -sD - -o /dev/null "http://localhost:3000$p" | grep -i -E 'HTTP/|set-cookie'
done
