#!/usr/bin/env bash
# Repro for https://github.com/vercel/next.js/issues/79770
# Installs Next.js into two independent projects and measures the per-project
# size of the platform-specific @next/swc-* native binary.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
work="${here}/.work"
rm -rf "$work"
for n in one two; do
  mkdir -p "$work/app-$n"
  cp "$here/app/package.json" "$work/app-$n/package.json"
  (cd "$work/app-$n" && npm install --no-audit --no-fund --silent)
done

echo "== next version =="
node -e "console.log(require('$work/app-one/node_modules/next/package.json').version)"

echo
echo "== node_modules size per project =="
du -sh "$work"/app-one/node_modules "$work"/app-two/node_modules

echo
echo "== @next/swc-* package size per project =="
du -sh "$work"/app-*/node_modules/@next/swc-*

echo
echo "== native .node binaries (size / inode / hardlink count) =="
find "$work" -name 'next-swc*.node' -exec stat -c '%s bytes inode=%i links=%h %n' {} \;

echo
echo "== checksums (identical file, stored twice) =="
find "$work" -name 'next-swc*.node' -exec md5sum {} \;
