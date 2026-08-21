#!/usr/bin/env bash
set -euo pipefail
tmp=$(mktemp -d)
git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git "$tmp/nextjs" >/dev/null 2>&1
cd "$tmp/nextjs"
git sparse-checkout set docs errors >/dev/null
echo "vercel/next.js canary @ $(git rev-parse HEAD)"
echo
echo "--- occurrences with @latest (per maintainer: these are the ones to fix) ---"
grep -rn "@next/codemod@latest" docs errors || true
echo
echo "counts:"
printf '  @canary: %s\n' "$(grep -ro "@next/codemod@canary" docs errors | wc -l | tr -d ' ')"
printf '  @latest: %s\n' "$(grep -ro "@next/codemod@latest" docs errors | wc -l | tr -d ' ')"
echo
echo "--- codemods documented with BOTH tags ---"
grep -rho "@next/codemod@\(latest\|canary\) [a-z0-9-]*" docs errors \
  | awk '{split($1,a,"@"); print $2" "a[3]}' | sort -u \
  | awk '{c[$1]=c[$1]" "$2} END {for (k in c) if (c[k] ~ /latest/ && c[k] ~ /canary/) print "  "k":"c[k]}'
