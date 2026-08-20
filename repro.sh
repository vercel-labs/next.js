#!/usr/bin/env bash
# Issue 62521: standalone output emits CommonJS server.js for an ESM project
# when the build directory (or distDir) is nested one level deeper.
set -u
npm install --no-audit --fund=false

echo "== A) build with a custom directory: next build custom-dir"
rm -rf custom-dir/.next deploy-out
npx next build custom-dir >/dev/null 2>&1

echo "-- first lines of custom-dir/.next/standalone/custom-dir/server.js"
head -3 custom-dir/.next/standalone/custom-dir/server.js
echo "-- package.json copied into standalone output? (expected: yes)"
ls custom-dir/.next/standalone/custom-dir/package.json 2>&1

echo "-- deploy the standalone folder (as a Dockerfile COPY would) and run it"
cp -r custom-dir/.next/standalone deploy-out
node deploy-out/custom-dir/server.js 2>&1 | head -8

echo
echo "== B) control: default distDir (next build)"
rm -rf .next
npx next build >/dev/null 2>&1
head -3 .next/standalone/server.js
ls .next/standalone/package.json
