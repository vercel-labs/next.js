#!/usr/bin/env bash
# Compares dev vs prod responses for an unknown multipart/form-data POST
# (no Next-Action header => treated as an MPA/progressive-enhancement action).
set -u
printf x > /tmp/f.txt

code() { curl -s -o /dev/null -w '%{http_code}' --max-time 120 "$@"; }

multipart() { code -X POST "http://localhost:$1/customer/address_file/upload" -F 'file=@/tmp/f.txt'; }

probe() { # $1 = port, $2 = label
  echo "--- $2 ---"
  code "http://localhost:$1/customer/x" > /dev/null # warm up the catch-all route
  echo "multipart POST /customer/address_file/upload -> $(multipart "$1")"
  echo "json POST      /customer/x                   -> $(code -X POST "http://localhost:$1/customer/x" -H 'content-type: application/json' -d '{}')"
  echo "GET            /customer/x                   -> $(code "http://localhost:$1/customer/x")"
}

npx next dev -p 3101 > dev.log 2>&1 &
DEV=$!
sleep 6
probe 3101 "next dev"
code "http://localhost:3101/" > /dev/null # compile the page that registers the Server Action
echo "multipart POST after visiting / in dev          -> $(multipart 3101)"
kill $DEV 2>/dev/null; pkill -f 'next dev' 2>/dev/null

npx next build > build.log 2>&1
npx next start -p 3102 > prod.log 2>&1 &
PROD=$!
sleep 6
probe 3102 "next start (production)"
kill $PROD 2>/dev/null; pkill -f 'next start' 2>/dev/null

echo
echo 'Bug: production always answers 500 (server log: "Failed to find Server Action..."),'
echo 'while dev answers 404 + x-nextjs-action-not-found: 1 until the action manifest is populated.'
