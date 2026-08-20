#!/usr/bin/env bash
# Reproduces issue #42437 (line endings rewritten by @next/codemod).
set -e
cd "$(dirname "$0")"
git checkout -- pages 2>/dev/null || true
echo "--- before ---"
for f in pages/crlf.js pages/lf.js; do echo "$f: CRLF lines = $(grep -c $'\r' "$f")"; done
npx --yes @next/codemod@canary new-link . --force
echo "--- after ---"
for f in pages/crlf.js pages/lf.js; do echo "$f: CRLF lines = $(grep -c $'\r' "$f")"; done
git --no-pager diff --stat
