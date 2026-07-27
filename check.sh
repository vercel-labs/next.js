#!/usr/bin/env bash
# Usage: ./check.sh https://your-deployment.vercel.app [iterations]
#
# Requests the unprefixed and the locale-prefixed variant of the same routes and
# reports how often the response is not the page that route should render.
set -u

BASE="${1:?usage: ./check.sh <base-url> [iterations]}"
N="${2:-40}"

# path|expected <title>
ROUTES="
/alpha|ALPHA PAGE
/beta|BETA PAGE
/gamma|GAMMA PAGE
/pt/alpha|ALPHA PAGE
/pt/beta|BETA PAGE
/pt/gamma|GAMMA PAGE
"

tmp=$(mktemp)
trap 'rm -f "$tmp" "$tmp.body"' EXIT

i=1
while [ "$i" -le "$N" ]; do
  echo "$ROUTES" | while IFS='|' read -r path expected; do
    [ -z "$path" ] && continue
    code=$(curl -s -o "$tmp.body" -w '%{http_code}' "$BASE$path")
    title=$(sed -n 's/.*<title>\([^<]*\).*/\1/p' "$tmp.body" | head -1)
    if [ "$code" != "200" ] || [ "$title" != "$expected" ]; then
      echo "$path|FAIL" >> "$tmp"
      echo "  MISMATCH $path -> HTTP $code, title '$title' (expected '$expected')"
    else
      echo "$path|OK" >> "$tmp"
    fi
  done
  i=$((i + 1))
done

echo
printf '%-12s %9s %9s\n' route requests failures
echo "$ROUTES" | while IFS='|' read -r path expected; do
  [ -z "$path" ] && continue
  total=$(grep -c "^$path|" "$tmp")
  fails=$(grep -c "^$path|FAIL" "$tmp")
  printf '%-12s %9s %9s\n' "$path" "$total" "$fails"
done
