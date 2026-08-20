#!/bin/bash
# usage: ./test-version.sh <next-version> <port>
V=$1; PORT=$2
npm i next@$V react@19.0.0 react-dom@19.0.0 typescript@5.6.3 --silent >/dev/null 2>&1
rm -rf .next
mkdir -p logs; LOG=logs/next-$V.log
npx next build > $LOG 2>&1
nohup npx next start -p $PORT >> $LOG 2>&1 &
sleep 6
node poll.mjs http://localhost:$PORT/cached/5s 26 > logs/poll-$V.txt 2>&1
curl -s -o /dev/null "http://localhost:$PORT/__shutdown" 
node summarize.mjs logs/poll-$V.txt
