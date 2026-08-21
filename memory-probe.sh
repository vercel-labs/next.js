#!/bin/bash
# Samples RSS of the Next.js dev server while requesting N unique dynamic routes.
# Usage: ./memory-probe.sh [port] [count]
PORT=${1:-3000}
N=${2:-3000}
for i in $(seq 1 "$N"); do
  curl -s -m 30 -o /dev/null "http://localhost:$PORT/en/events/$i/payments/$i" || echo "FAIL $i"
  ps -eo rss,args --no-headers | grep "next-server" | grep -v grep \
    | awk -v i="$i" '{print i, $1/1024 " MB"}'
done
