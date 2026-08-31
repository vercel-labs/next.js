#!/bin/bash
# Reproduction driver for next#98094 (abort-retention).
# usage: ./protocol.sh <abort|complete> [port]
set -u
MODE=${1:-abort}; PORT=${2:-3000}
M(){ curl -s "http://localhost:$PORT/api/mem?gc=1&label=$1"; echo; }
[ "$MODE" = abort ] && EXTRA="--max-time 0.4" || EXTRA=""
DOSE(){ seq $1 $2 | xargs -P 50 -I{} curl -s -o /dev/null $EXTRA "http://localhost:$PORT/products/item-{}"; }
seq 1 10 | xargs -P 5 -I{} curl -s -o /dev/null "http://localhost:$PORT/products/warm-{}"
M warm
DOSE 1 1500;    M dose1
DOSE 1501 3000; M dose2
sleep 40;  M idle40
sleep 60;  M idle100
