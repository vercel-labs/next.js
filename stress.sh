#!/bin/bash
LOG=./stress.log
: > $LOG
i=0
while [ $i -lt 60000 ]; do
  for p in / /about /api/health; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${PORT:-3000}$p")
    if [ "$code" != "200" ]; then echo "$(date -Is) $p -> $code (iter $i)" >> $LOG; fi
  done
  i=$((i+1))
done
echo "$(date -Is) done iters=$i" >> $LOG
