#!/usr/bin/env bash
# Reproduces https://github.com/vercel/next.js/issues/47394
#
# webpack's filesystem cache ("PackFileCacheStrategy") snapshots the *resolve*
# dependencies of the build, which requires reading the directories above the
# project. If any ancestor directory is not readable by the user running the
# build (execute-only, e.g. shared hosting: `/usr/www/users` in the report),
# snapshotting fails with EACCES, webpack prints
#   <w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack:
#       Error: Unable to snapshot resolve dependencies
# and .next/cache/webpack is never written, so every build is a cold build.
#
# Must NOT be run as root (root ignores directory permissions).
set -euo pipefail

if [ "$(id -u)" = "0" ]; then
  echo "Run this script as a non-root user (root bypasses file permissions)." >&2
  exit 1
fi

here="$(cd "$(dirname "$0")" && pwd)"
work="${WORK_DIR:-$here/.repro-work}"
parent="$work/execute-only-parent"

chmod u+rwx "$parent" 2>/dev/null || true
rm -rf "$work"
mkdir -p "$parent/app"
cp -R "$here/package.json" "$here/next.config.js" "$here/app" "$parent/app/"

cd "$parent/app"
npm install --no-audit --fund=false

# Make the parent directory traversable but NOT readable (mode 0111).
chmod 0111 "$parent"

set +e
npm run build 2>&1 | tee "$work/build.log"
set -e
chmod u+rwx "$parent"

echo
echo "=== result ==="
grep -n "EACCES\|Unable to snapshot resolve dependencies" "$work/build.log" | head -5 || echo "no warning: NOT reproduced"
if [ -d "$parent/app/.next/cache/webpack" ]; then
  echo "webpack cache written: $(du -sh "$parent/app/.next/cache/webpack" | cut -f1)"
else
  echo "BUG: .next/cache/webpack was never written (cache silently disabled)"
fi
