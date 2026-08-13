#!/bin/bash
# usage: run.sh <logname> <port> <probeport> [measure args...]
set -e
LOGDIR=/workspace/.next-maintainer/reproduction-artifacts/next-server
LOG=$LOGDIR/$1.log; PORT=$2; PROBE=$3; shift 3
cd /workspace/repro/.next/standalone
PORT=$PORT PROBE_PORT=$PROBE node --expose-gc -r /workspace/repro/probe.cjs server.js > $LOG 2>&1 &
SRV=$!
cd /workspace/repro
for i in $(seq 40); do curl -sf localhost:$PROBE >/dev/null && break; sleep 0.5; done
APP_PORT=$PORT PROBE_PORT=$PROBE node "$@" || true
kill $SRV 2>/dev/null || true
sleep 1
