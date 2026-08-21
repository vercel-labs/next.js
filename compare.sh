#!/usr/bin/env bash
# Compare `next build` wall time between two Next.js versions.
# Host mode:   ./compare.sh host   [SCALE]
# Docker mode: ./compare.sh docker [SCALE]      (SCALE=1 generates 40 routes x 40 client components)
set -u
MODE=${1:-host}; SCALE=${2:-0}
for V in 15.1.7 15.2.4; do
  if [ "$MODE" = docker ]; then
    s=$(date +%s)
    docker build --no-cache --progress=plain \
      --build-arg NEXT_VERSION=$V --build-arg SCALE=$SCALE -t next-$V-repro . > docker-$V.log 2>&1
    echo "docker next@$V exit=$? elapsed=$(( $(date +%s)-s ))s  (see docker-$V.log)"
  else
    rm -rf work-$V && cp -r app work-$V && rm -rf work-$V/node_modules work-$V/.next
    ( cd work-$V && npm pkg set dependencies.next=$V devDependencies.eslint-config-next=$V >/dev/null \
      && npm install --no-audit --no-fund >/dev/null 2>&1 )
    [ "$SCALE" = 1 ] && bash gen.sh work-$V
    s=$(date +%s)
    ( cd work-$V && NEXT_TELEMETRY_DISABLED=1 npx next build > ../build-$V.log 2>&1 )
    echo "host next@$V exit=$? elapsed=$(( $(date +%s)-s ))s  (see build-$V.log)"
  fi
done
