#!/bin/bash
# Reproduction for https://github.com/vercel/next.js/issues/63201
# Builds the same, unchanged source twice from a clean state and diffs the
# exported output. `generateBuildId` is pinned in next.config.js so the random
# per-build id does not mask real non-determinism.
set -u
ATTEMPTS=${1:-20}
for i in $(seq 1 "$ATTEMPTS"); do
  rm -rf .next out out_back
  npm run build > /tmp/build-$i-a.log 2>&1 || { echo "build A failed (see /tmp/build-$i-a.log)"; exit 2; }
  mv out out_back
  rm -rf .next
  npm run build > /tmp/build-$i-b.log 2>&1 || { echo "build B failed (see /tmp/build-$i-b.log)"; exit 2; }
  if diff -r out_back out > /dev/null; then
    echo "attempt $i: identical"
  else
    echo "!!!!!!!!!!!!! attempt $i: TWO BUILD OUTPUTS ARE DIFFERENT !!!!!!!!!!!!!"
    diff -rq out_back out
    exit 1
  fi
done
echo "all $ATTEMPTS attempts identical"
