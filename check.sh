#!/usr/bin/env bash
# Usage: ./check.sh https://your-deployment.vercel.app
BASE=${1:-http://localhost:3000}
for p in / /exists /nosuchpage /a/b; do
  printf '%s -> ' "$p"
  curl -s -o /tmp/o -w 'HTTP %{http_code} ' "$BASE$p"
  grep -o 'CUSTOM NOT FOUND PAGE\|HOME PAGE\|SLUG PAGE' /tmp/o | head -1 || echo '(other/platform page)'
done
