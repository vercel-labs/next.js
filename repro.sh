#!/bin/bash
# Usage: sudo ./repro.sh            (runs both scenarios)
# Requires root to create/remove /.dockerenv, which is how next's bundled
# `is-docker` detects a container (CircleCI / GitLab dind hit the same path).
set -u
cd "$(dirname "$0")"
npm install --no-audit --fund=false >/dev/null
node generate.mjs

run() {
  local label=$1
  rm -rf .next
  for i in 1 2 3; do
    npx next build --webpack > "build-$label-$i.log" 2>&1
    echo "$label build $i: $(grep -o 'Compiled successfully in [0-9a-z.]*' "build-$label-$i.log" | head -1) | .rscinfo present: $(test -f .next/cache/.rscinfo && echo yes || echo no)"
  done
}

rm -f /.dockerenv;  run not-docker
touch /.dockerenv;  run docker
rm -f /.dockerenv
