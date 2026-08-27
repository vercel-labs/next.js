#!/bin/bash
cd /workspace/repro
node gen.js 40
ART=/workspace/.next-maintainer/reproduction-artifacts
for run in $(seq 1 "$1"); do
  rm -rf .next
  npx next build > $ART/next-server/build-$run.log 2>&1 || { echo "build fail $run" >> $ART/next-server/sample.log; continue; }
  npx next start -p 3000 > $ART/next-server/start-run$run.log 2>&1 &
  SP=$!
  sleep 5
  RUN=$run node check.js "$2" >> $ART/next-server/sample.log 2>&1
  echo "== run $run exit $?" >> $ART/next-server/sample.log
  kill -9 $SP 2>/dev/null; pkill -9 -P $SP 2>/dev/null; sleep 2
done
echo DONE >> $ART/next-server/sample.log
