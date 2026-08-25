#!/bin/bash
BOOTS=$1; LOG=$2
mkdir -p "$LOG"
for i in $(seq 1 $BOOTS); do
  rm -rf .next
  PORT=$((3100+i))
  L="$LOG/boot-$i.log"
  setsid npx next dev --port $PORT > "$L" 2>&1 &
  PID=$!
  for t in $(seq 1 180); do grep -q "Ready in" "$L" && break; sleep 1; done
  if grep -q "Ready in" "$L"; then
    C1=$(curl -s -o /dev/null -w "%{http_code}" --max-time 150 "http://127.0.0.1:$PORT/vardcentral/slug-1/ring")
    C2=$(curl -s -o /dev/null -w "%{http_code}" --max-time 150 "http://127.0.0.1:$PORT/en/vardcentral/slug-1/ring")
    C3=$(curl -s -o /dev/null -w "%{http_code}" --max-time 150 "http://127.0.0.1:$PORT/plain/slug-1/ring")
    C4=$(curl -s -o /dev/null -w "%{http_code}" --max-time 150 "http://127.0.0.1:$PORT/kommun/slug-2/feed.xml")
    echo "boot $i: ring=$C1 en=$C2 plain=$C3 feed=$C4"
  else
    echo "boot $i: NO-READY"
  fi
  kill -9 -$PID 2>/dev/null
  sleep 2
done
echo DONE
