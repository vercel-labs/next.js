#!/bin/bash
cd /workspace/vercheck
LOG=/workspace/.next-maintainer/reproduction-artifacts/next-server/$1.log
rm -rf .next
ASSET_PREFIX="$3" setsid nohup ./node_modules/.bin/next dev --port 3400 $2 > $LOG 2>&1 &
echo $! > /tmp/dev.pgid
for i in $(seq 1 90); do grep -qE "Ready in" $LOG && break; sleep 1; done
sleep 2
echo "=== $1 (flags='$2' ASSET_PREFIX='$3') ==="
grep -E "Ready in|assetPrefix|Error" $LOG | head -3
