#!/bin/sh
LOG=/workspace/.next-maintainer/reproduction-artifacts/next-server
nohup ./scripts/serve-b.sh > $LOG/serve-B.log 2>&1 &
sleep 4
nohup node scripts/cdn.js > $LOG/cdn.log 2>&1 &
sleep 2
