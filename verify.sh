#!/usr/bin/env bash
set -u
PORT=3100
BASE="http://localhost:$PORT"
LOG=server-verify.log
img() { echo "$BASE/_next/image?url=%2Fbig.jpg&w=$1&q=$2"; }
rm -rf .next/cache/images
npx next start -p $PORT > "$LOG" 2>&1 &
SP=$!
until curl -s -o /dev/null -m 2 "$BASE/"; do kill -0 $SP || { cat "$LOG"; exit 1; }; sleep 0.3; done
echo "server up pid $SP"

echo "--- baseline: cold transform, NO abort (w=1200 q=60) ---"
curl -s -o /dev/null -m 120 -w "  status=%{http_code} total=%{time_total}s\n" "$(img 1200 60)"
echo "--- baseline: cold transform, NO abort (w=64 q=60) ---"
curl -s -o /dev/null -m 120 -w "  status=%{http_code} total=%{time_total}s\n" "$(img 64 60)"

HUNG=""
i=0
for q in 50 75 90; do
for w in 32 48 64 96 128 256 384 640 750 828 1080 1200 1920 2048; do
  i=$((i+1))
  d=$(awk "BEGIN{printf \"%.3f\", 0.005 + ($i % 11) * 0.012}")
  U=$(img $w $q)
  curl -s -o /dev/null -m "$d" "$U" >/dev/null 2>&1
  R=$(curl -s -o /dev/null -m 45 -w "%{http_code}:%{time_total}" "$U")
  code=${R%%:*}
  printf "abort@%-6s w=%-5s q=%-3s -> %s\n" "$d" "$w" "$q" "$R"
  [ "$code" != "200" ] && HUNG="$HUNG $w:$q"
done
done
echo "HUNG:$HUNG"
if [ -n "$HUNG" ]; then
  echo "--- recheck hung keys with 120s timeout, and a healthy key in between ---"
  for k in $HUNG; do
    w=${k%%:*}; q=${k##*:}
    echo "  hung key w=$w q=$q: $(curl -s -o /dev/null -m 120 -w '%{http_code}:%{time_total}' "$(img $w $q)")"
  done
  echo "  fresh unrelated key w=1440 q=70: $(curl -s -o /dev/null -m 120 -w '%{http_code}:%{time_total}' "$(img 1440 70)")"
  echo "  server alive: $(curl -s -o /dev/null -m 10 -w '%{http_code}' "$BASE/")"
fi
kill $SP 2>/dev/null; wait $SP 2>/dev/null
echo "=== server log ==="; cat "$LOG"
