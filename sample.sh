#!/bin/bash
# usage: ./sample.sh <fresh-builds> <submissions-per-build>
set -u
cd "$(dirname "$0")"
node gen.js 40
mkdir -p logs
: > logs/sample.log
for run in $(seq 1 "${1:-5}"); do
  rm -rf .next
  npx next build > "logs/build-$run.log" 2>&1 || { echo "build fail $run" >> logs/sample.log; continue; }
  npx next start -p 3000 > "logs/start-$run.log" 2>&1 &
  SP=$!
  sleep 5
  RUN=$run node check.js "${2:-16}" >> logs/sample.log 2>&1
  echo "== run $run exit $?" >> logs/sample.log
  kill -9 $SP 2>/dev/null; pkill -9 -P $SP 2>/dev/null; sleep 2
done
echo DONE >> logs/sample.log
cat logs/sample.log
