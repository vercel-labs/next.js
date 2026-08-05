#!/usr/bin/env bash
set -x
pnpm install
node echo-server.js &
sleep 1
ENABLE_TEST_PROXY=true ./node_modules/.bin/next build
ENABLE_TEST_PROXY=true ECHO_PORT=3901 ./node_modules/.bin/next start -p 3900 &
sleep 7
time curl -s -m 15 http://localhost:3900/api/probe
echo "curl exit=$?  (28 = hang reproduced)"
