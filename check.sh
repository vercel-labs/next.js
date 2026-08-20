#!/bin/bash
# Run after: npm install && npm run build && npm start  (server on :3000)
for host in example.com example.pl; do
  for p in / /about /en /en/about /pl /pl/about; do
    code=$(curl -s -o /tmp/body -w '%{http_code}' -H "Host: $host" "http://localhost:3000$p")
    loc=$(grep -o '"locale":"[a-z]*"' /tmp/body | head -1)
    echo "$host$p -> $code $loc"
  done
done
