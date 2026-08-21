#!/usr/bin/env bash
# Reproduces the Turbopack FATAL panic in try_get_next_package by moving pnpm's
# virtual store (node_modules/.pnpm) outside the inferred Turbopack project root,
# which is what pnpm symlink/junction layouts can look like on Windows.
set -eux
pnpm install || true
if [ -d node_modules/.pnpm ] && [ ! -L node_modules/.pnpm ]; then
  mv node_modules/.pnpm ../external-pnpm-store
  ln -s "$(cd .. && pwd)/external-pnpm-store" node_modules/.pnpm
fi
# next is still resolvable by Node:
node -e "console.log(require.resolve('next/package.json'))"
# but Turbopack panics:
./node_modules/.bin/next dev
