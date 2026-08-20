#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/48017
# `output: "standalone"` with pnpm produces a node_modules tree made of symlinks
# into node_modules/.pnpm. Any transfer that does NOT preserve symlinks
# (BSD/macOS `cp -r`, `tar -h`, `zip -r` without --symlinks,
# actions/upload-artifact@v4, some docker COPY setups) breaks module resolution.
set -u
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

pnpm install
pnpm build

rm -rf /tmp/repro48017-a /tmp/repro48017-b

echo "=== A: copy preserving symlinks (cp -a) ==="
cp -a .next/standalone /tmp/repro48017-a
(cd /tmp/repro48017-a && PORT=3121 timeout 15 node server.js 2>&1 | head -20)

echo
echo "=== B: copy dereferencing symlinks (cp -rL, same as macOS 'cp -r' / upload-artifact@v4) ==="
cp -rL .next/standalone /tmp/repro48017-b
(cd /tmp/repro48017-b && PORT=3122 timeout 15 node server.js 2>&1 | head -20)

echo
echo "Expected: A starts and serves; B crashes with MODULE_NOT_FOUND (e.g. '@swc/helpers/_/_interop_require_default' or 'styled-jsx')."
