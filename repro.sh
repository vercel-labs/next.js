#!/usr/bin/env bash
# Reproduces vercel/next.js#51870 on Linux (bash must support ulimit -v).
set -u
npm install
echo "== baseline build (no vm limit) =="
npx next build && echo "BASELINE OK"
rm -rf .next
echo "== build with virtual memory limited to 2 GB (cPanel / CloudLinux style limit) =="
bash -c 'ulimit -v 2048000; npx next build'
echo "build exit=$?"
echo "== next dev with the same limit =="
bash -c 'ulimit -v 2048000; timeout 30 npx next dev -p 3111'
echo "dev exit=$?"
