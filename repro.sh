#!/usr/bin/env bash
# Automates the manual "edit and save" steps from https://github.com/vercel/next.js/issues/45483
# Usage: npm install && npm run dev  (in one terminal), then: bash repro.sh
set -e
COUNT=/tmp/connection-count.txt
echo "start: total connections opened = $(cat $COUNT 2>/dev/null || echo 0)"
for i in 1 2 3 4 5; do
  echo "// fast refresh edit $i" >> db/connect.ts   # simulates saving the file in the editor
  sleep 3
  curl -s localhost:3000/ | grep -o 'plain connection id: [0-9]*' | head -1
  curl -s localhost:3000/ | grep -o 'globalThis connection id: [0-9]*' | head -1
  echo "after edit $i: total connections opened = $(cat $COUNT)"
done
