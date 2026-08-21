#!/usr/bin/env bash
# Reproduces vercel/next.js#77550: Next.js mangles NODE_OPTIONS preload flags.
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p logs

run() { # name, NODE_OPTIONS, port
  echo "=== $1 : NODE_OPTIONS=$2"
  ( cd "$DIR" && NODE_OPTIONS="$2" npx next dev -p "$3" > "logs/$1.log" 2>&1 & echo $! > "logs/$1.pid" )
  sleep 20
  kill "$(cat "logs/$1.pid")" 2>/dev/null
  pkill -f "next dev -p $3" 2>/dev/null
  cat "logs/$1.log"
  echo
}

run case1-dash-r      "-r $DIR/a.cjs"                             3101
run case2-two-require "--require $DIR/a.cjs --require $DIR/b.cjs" 3102
run case3-equals-form "--require=$DIR/a.cjs --require=$DIR/b.cjs" 3103
echo "case1 expected: crash '--r= is not allowed in NODE_OPTIONS'"
echo "case2 expected: crash MODULE_NOT_FOUND 'a.cjs b.cjs'"
echo "case3 expected: server starts but only 'preload-b loaded' in the spawned worker (a.cjs silently dropped)"
