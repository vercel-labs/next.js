#!/usr/bin/env bash
# Usage: ./run-test.sh /middleware/axios   (also try /middleware/fetch, /axios, /fetch)
set -e
ROUTE=${1:-/middleware/axios}
node mockServer.js & MOCK=$!
npm run build
rm -f *.heapsnapshot
NODE_OPTIONS="--heapsnapshot-signal=SIGUSR2" npx next start & 
sleep 8
PID=$(pgrep -f 'next-server \(v' | head -1)
echo "next-server pid $PID"
kill -USR2 "$PID"; sleep 12; grep VmRSS /proc/$PID/status 2>/dev/null || ps -o rss= -p $PID
for c in 1 2 3; do
  node load.js "http://localhost:3000$ROUTE" 2000
  kill -USR2 "$PID"; sleep 18            # each snapshot forces a full GC
  echo "cycle$c $(grep VmRSS /proc/$PID/status 2>/dev/null || ps -o rss= -p $PID)"
done
kill "$PID" "$MOCK"
echo "heap snapshots written to $(pwd)/*.heapsnapshot"
