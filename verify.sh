#!/usr/bin/env bash
# Usage: ./verify.sh https://<your-vercel-deployment-url>
set -u
BASE="$1"
echo "== HTML (basePath /test) =="
curl -s -o /dev/null -w "  GET %{url_effective} -> %{http_code}\n" "$BASE/test/en"
echo "== segment-cache tree prefetch (what the Next 16 client sends on <Link> prefetch) =="
curl -s -o /dev/null -w "  GET %{url_effective} -> %{http_code}\n" \
  -H 'RSC: 1' -H 'Next-Router-Prefetch: 1' -H 'Next-Router-Segment-Prefetch: /_tree' \
  "$BASE/test/en/other?_rsc=abcde"
echo "  (expected 200; broken versions return 404)"
