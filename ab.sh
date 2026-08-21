#!/usr/bin/env bash
# Deterministic proof that the two Turbopack Node.js pools emit *different*
# `[turbopack]_runtime.js` variants to the *same* path.
#
# A: only the postcss pool runs   -> runtime contains the asyncModule helper
# B: only the webpack-loaders pool runs -> runtime does NOT contain it
#
# Both write .next/build/chunks/[turbopack]_runtime.js. When both pools run in
# one build (the normal case: postcss.config.js + any .scss), whichever writes
# last wins, and if B wins the postcss config loader — an async module — dies with
# `TypeError: __turbopack_context__.a is not a function`.
set -u
RT='.next/build/chunks/[turbopack]_runtime.js'

report() {
  printf '  asyncModule occurrences: %s\n' "$(grep -c asyncModule "$RT" 2>/dev/null | head -1)"
  printf '  runtime size: %s bytes\n' "$(wc -c < "$RT" | tr -d ' ')"
  printf '  pools spawned: %s\n' "$(ls .next/build/chunks/ | grep -c '^pool_entry-.*\._\.js$')"
  ls .next/build/chunks/ | grep '^pool_entry-.*\._\.js$' | sed 's/^/    /'
}

echo "== A: postcss pool only (no .scss import) =="
cp app/page.js /tmp/page.orig
cat > app/page.js <<'EOF'
import a from "../styles/a.module.css";
export default function Page() {
  return <h1 className={a.title}>hello</h1>;
}
EOF
rm -rf .next && npm run build >/dev/null 2>&1
report

echo "== B: webpack-loaders (sass) pool only (postcss.config.js removed) =="
cp /tmp/page.orig app/page.js
mv postcss.config.js /tmp/postcss.config.js.off
rm -rf .next && npm run build >/dev/null 2>&1
report
mv /tmp/postcss.config.js.off postcss.config.js

echo "== both pools in one build =="
rm -rf .next && npm run build >/dev/null 2>&1
report
