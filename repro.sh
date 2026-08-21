#!/usr/bin/env bash
# Reproduces vercel/next.js#82017 on next@16.3.1-canary.26
set -u
run() {
  variant="$1"
  echo "================ scenario: module=$variant ================"
  rm -rf .next tsconfig.tsbuildinfo
  cp "tsconfig.$variant.json" tsconfig.json
  npx next build 2>&1 | grep -E "moduleResolution|error TS|Failed to type check|Compiled successfully"
  echo "--- resulting tsconfig.json compilerOptions.moduleResolution:"
  grep -n '"moduleResolution"' tsconfig.json || echo "(none)"
  echo "--- tsgo (TypeScript 7 native preview) on the tsconfig Next.js just wrote:"
  npx tsgo --noEmit -p tsconfig.json 2>&1 | head -5
  echo
}
run commonjs
run nodenext
