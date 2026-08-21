#!/usr/bin/env bash
# Docker-free reproduction of vercel/next.js#89851.
# Simulates a monorepo multi-stage Docker build by building at a deep path
# (node_modules hoisted one level above the app) and then copying .next +
# node_modules to a shallower path, exactly like `COPY --from=builder`.
# Requires root (writes to /wsbuild and /app), Node 20+.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

# --- builder stage: /wsbuild (node_modules) + /wsbuild/app (next app) ---
rm -rf /wsbuild /app
mkdir -p /wsbuild
cp -r "$HERE/app" /wsbuild/app
cp "$HERE/app/package.json" /wsbuild/package.json
(cd /wsbuild && npm install --no-audit --fund=false)
ln -s /wsbuild/node_modules /wsbuild/app/node_modules
(cd /wsbuild/app && NEXT_TELEMETRY_DISABLED=1 npx next build)

echo "=== Builder symlinks (/wsbuild/app/.next/node_modules) ==="
find /wsbuild/app/.next/node_modules -type l -exec sh -c 'echo "  {} -> $(readlink {})"' \;

# --- runtime stage: everything one level shallower, at /app ---
mkdir -p /app
cp -a /wsbuild/node_modules /app/node_modules
cp -a /wsbuild/app/.next /app/.next
cp /wsbuild/app/package.json /app/package.json

echo "=== Runtime symlinks (/app/.next/node_modules) ==="
find /app/.next/node_modules -type l -exec sh -c \
  'if [ ! -e "{}" ]; then echo "  BROKEN: {} -> $(readlink {})"; else echo "  OK: {} -> $(readlink {})"; fi' \;

cd /app
setsid env PORT=3000 NEXT_TELEMETRY_DISABLED=1 npx next start > /tmp/next-start.log 2>&1 < /dev/null &
sleep 8
echo "=== curl http://localhost:3000/ ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/
grep -m1 "Cannot find module" /tmp/next-start.log || true
pkill -f next-server || true
