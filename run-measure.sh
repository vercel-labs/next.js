#!/bin/bash
# usage: ./run-measure.sh baseline|fix <port> [requests]
set -u
MODE=$1; PORT=${2:-3101}; N=${3:-200}
if [ "$MODE" = "fix" ]; then export NEXT_ABORT_FIX=1; else unset NEXT_ABORT_FIX || true; fi
PORT=$PORT node --expose-gc .next/standalone/server.js > "server-$MODE.log" 2>&1 &
SRV=$!
sleep 6
echo "[$MODE] start:            $(curl -s "localhost:$PORT/api/mem?gc=1")"
for i in $(seq 1 "$N"); do curl -s -o /dev/null "localhost:$PORT/p/x$MODE$i"; done
sleep 2
echo "[$MODE] signals kept:     $(curl -s "localhost:$PORT/api/mem?gc=1")"
echo "[$MODE] signals dropped:  $(curl -s "localhost:$PORT/api/mem?gc=1&drop=1")"
kill -9 $SRV
