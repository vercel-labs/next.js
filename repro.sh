#!/bin/bash
# Reproduction for https://github.com/vercel/next.js/issues/97434
# Runs the same crawl twice against a standalone build:
#   A) default Error.stackTraceLimit (10)
#   B) Error.stackTraceLimit = 0
# In both runs a bounded number (RETAIN, default 5000) of abort reasons is held
# alive, simulating any long-lived retention of an abort reason in a real app.
set -e
cd "$(dirname "$0")"
RETAIN=${RETAIN:-5000}
N=${N:-2000}
CONC=${CONC:-24}

npm install
npx next build
cp instrument.js .next/standalone/
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

run() { # $1=port $2=label $3=extra env
  ( cd .next/standalone && env PORT=$1 RETAIN=$RETAIN $3 node --expose-gc --require ./instrument.js server.js > "../../server-$2.log" 2>&1 & )
  sleep 6
  BASE=http://127.0.0.1:$1 N=$N CONC=$CONC node crawl.mjs | tee "crawl-$2.txt"
  pkill -f 'next-server' || true
  sleep 2
}

echo "=== A: default Error.stackTraceLimit ==="
run 3200 default-stack ""
echo "=== B: Error.stackTraceLimit = 0 ==="
run 3201 stacktracelimit0 "STL0=1"
echo
echo "Compare the final 'idle 30s + forced gc' arrayBuffers value in crawl-default-stack.txt vs crawl-stacktracelimit0.txt"
