#!/usr/bin/env bash
# Shows that the async config loader — the thing that needs `__turbopack_context__.a` —
# is emitted only for a `.js` postcss config, and disappears for `.cjs`.
set -u

probe() {
  rm -rf .next && npm run build >/dev/null 2>&1
  printf '  chunks referencing an async config loader: %s\n' \
    "$(grep -rl 'postcss\.config\.[a-z]*_\._*loader\.mjs' .next/build/chunks/*.js 2>/dev/null | wc -l | tr -d ' ')"
  printf '  loader name: %s\n' \
    "$(grep -rho 'postcss\.config\.[a-z]*_\.loader\.[a-z]*' .next/build/chunks/*.js 2>/dev/null | sort -u | tr '\n' ' ')"
  printf '  asyncModule occurrences in runtime: %s\n' \
    "$(grep -c asyncModule '.next/build/chunks/[turbopack]_runtime.js' 2>/dev/null | head -1)"
}

echo "== postcss.config.js =="
probe

echo "== postcss.config.cjs (same file, renamed) =="
mv postcss.config.js postcss.config.cjs
probe
mv postcss.config.cjs postcss.config.js
