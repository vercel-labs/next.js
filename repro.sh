#!/bin/bash
# Measures next-server RSS while POSTing a large body to an API route that never reads it.
# Usage: ./repro.sh [payload MB]   (run once with middleware.js present, once with it removed)
set -u
MB=${1:-400}
LABEL=$([ -f middleware.js ] && echo with-middleware || echo no-middleware)
mkdir -p logs
npx next build > logs/build-$LABEL.log 2>&1 || { tail -20 logs/build-$LABEL.log; exit 1; }
npx next start -p 3000 > logs/server-$LABEL.log 2>&1 &
for _ in $(seq 1 60); do curl -sf -o /dev/null http://localhost:3000/ && break; sleep 1; done
show() { for p in $(pgrep -f 'next-server \(v'); do echo "  rss=$(awk '/VmRSS/{print int($2/1024)}' /proc/$p/status)MB peakRSS=$(awk '/VmHWM/{print int($2/1024)}' /proc/$p/status)MB"; done; }
echo "== $LABEL: before request"; show
[ -f /tmp/payload_$MB.bin ] || head -c $((MB*1024*1024)) /dev/zero | tr '\0' 'A' > /tmp/payload_$MB.bin
curl -s -o /dev/null -w "   response: http=%{http_code} bytes_uploaded=%{size_upload} time=%{time_total}s\n" \
  -X POST http://localhost:3000/api/upload -H 'Content-Type: application/json' -H 'Expect:' \
  --data-binary @/tmp/payload_$MB.bin
sleep 5;  echo "== $LABEL: 5s after request";  show
sleep 25; echo "== $LABEL: 30s after request"; show
for p in $(pgrep -f 'next-server \(v'); do kill -9 $p; done
