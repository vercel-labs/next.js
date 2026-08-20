#!/usr/bin/env bash
# Reproduces https://github.com/vercel/next.js/issues/64093
# EMFILE: too many open files during `next build`
set -u
npm install
echo "=== webpack build with a low file-descriptor limit (simulates a machine/OS fd limit) ==="
rm -rf .next
bash -c 'ulimit -n 96; echo "ulimit -n = $(ulimit -n)"; npx next build --webpack; echo "EXIT=$?"' 2>&1 | tee build-webpack.log
echo
echo "=== turbopack build with an even lower limit (for comparison) ==="
rm -rf .next
bash -c 'ulimit -n 64; echo "ulimit -n = $(ulimit -n)"; npx next build; echo "EXIT=$?"' 2>&1 | tee build-turbopack.log
