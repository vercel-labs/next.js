#!/usr/bin/env bash
# Audits docs/01-app/03-api-reference/05-config/01-next-config-js in vercel/next.js@canary
# for CommonJS-only (module.exports) config examples, missing js/ts switcher, and missing highlight.
set -euo pipefail
DIR=${1:-$(mktemp -d)/next.js}
if [ ! -d "$DIR" ]; then
  git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git "$DIR"
  git -C "$DIR" sparse-checkout set docs
fi
echo "next.js HEAD: $(git -C "$DIR" rev-parse HEAD)"
cd "$DIR/docs/01-app/03-api-reference/05-config/01-next-config-js"
total=0; cjs=0; cjs_no_ts=0; hl=0
printf '%-42s %6s %9s %10s\n' FILE CJS SWITCHER HIGHLIGHT
for f in *.mdx; do
  total=$((total+1))
  c=$(grep -c 'module.exports' "$f" || true)
  s=$(grep -c 'switcher' "$f" || true)
  h=$(grep -c 'highlight={' "$f" || true)
  [ "$c" -gt 0 ] && cjs=$((cjs+1))
  [ "$c" -gt 0 ] && [ "$s" -eq 0 ] && cjs_no_ts=$((cjs_no_ts+1))
  [ "$h" -gt 0 ] && hl=$((hl+1))
  printf '%-42s %6s %9s %10s\n' "$f" "$c" "$s" "$h"
done
echo
echo "pages total:                       $total"
echo "pages using CommonJS module.exports: $cjs"
echo "  of those, no js/ts switcher:       $cjs_no_ts"
echo "pages using highlight={...}:         $hl"
echo
echo "--- allowedDevOrigins.mdx (page named in the issue) ---"
cat allowedDevOrigins.mdx
