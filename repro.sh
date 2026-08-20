#!/usr/bin/env bash
# Reproduces vercel/next.js#45659:
# app-dir main-app-[hash].js chunk hash changes when the identical project is
# built from a different absolute directory (webpack builds), even though
# generateBuildId is pinned.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
work="$(mktemp -d)"
for d in a b; do
  mkdir -p "$work/$d"
  cp -r "$here"/{package.json,next.config.js,app,node_modules} "$work/$d/" 2>/dev/null || true
  (cd "$work/$d" && rm -rf .next && npx next build --webpack >"$work/$d.log" 2>&1)
  echo "--- build in $work/$d"
  ls "$work/$d/.next/static/chunks" | sort
done
echo
echo "diff of chunk file names (a vs b):"
diff <(ls "$work/a/.next/static/chunks" | sort) <(ls "$work/b/.next/static/chunks" | sort) \
  && echo "IDENTICAL - not reproduced" \
  || echo "DIFFERENT main-app hash -> bug reproduced"
