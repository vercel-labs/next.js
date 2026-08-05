#!/usr/bin/env bash
# A/B: Turbopack (default) vs webpack (default) vs Turbopack with serverSourceMaps:false
set -e
report() {
  echo "== $1"
  echo "   .map files under .next/server: $(find .next/server -name '*.map' | wc -l)"
  echo "   unique maps (md5):             $(find .next/server -name '*.map' -exec md5sum {} + | awk '{print $1}' | sort -u | wc -l)"
  echo "   .next/server size:             $(du -sh .next/server | cut -f1)"
}
rm -rf .next; npx next build > /tmp/turbopack.log 2>&1; report "turbopack (default)"
rm -rf .next; SERVER_SOURCE_MAPS=false npx next build > /tmp/turbopack-false.log 2>&1; report "turbopack (experimental.serverSourceMaps: false)"
rm -rf .next; npx next build --webpack > /tmp/webpack.log 2>&1; report "webpack (default)"
