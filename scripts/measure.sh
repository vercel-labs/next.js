#!/usr/bin/env bash
# Builds the same page twice (with and without a bare `typeof Buffer` check)
# and prints the resulting client chunk sizes.
set -e
cd "$(dirname "$0")/.."
BUNDLER_FLAG=""
[ "$1" = "webpack" ] && BUNDLER_FLAG="--webpack"

run() {
  rm -rf .next
  npx next build $BUNDLER_FLAG > "/tmp/build-$1.log" 2>&1 || { tail -30 "/tmp/build-$1.log"; exit 1; }
  echo "--- $1 (${BUNDLER_FLAG:---turbopack}) client chunks ---"
  du -b $(find .next/static/chunks -name '*.js') | sort -n | tail -4
  echo "buffer polyfill present in: $(grep -rl INSPECT_MAX_BYTES .next/static/chunks | wc -l) chunk(s)"
}

cp pages/index.js /tmp/index-with-buffer.js
run with-typeof-buffer
cat > pages/index.js <<'PAGE'
export default function Home() {
  return <p>baseline</p>
}
PAGE
run baseline
cp /tmp/index-with-buffer.js pages/index.js
