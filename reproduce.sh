#!/usr/bin/env bash
# Reproduces vercel/next.js#87737
# Build here, ship a tar.gz without node_modules (the common CI/CD artifact flow),
# reinstall deps in the target dir, then `next start`.
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="${here}/../repro-target"

pnpm install
pnpm build

echo "--- build-time alias symlink in .next/node_modules ---"
ls -la .next/node_modules

rm -rf "$out" && mkdir -p "$out"
tar --exclude node_modules -czf /tmp/repro-artifact.tar.gz -C "$here" .
tar -xzf /tmp/repro-artifact.tar.gz -C "$out"

cd "$out"
pnpm install
echo "--- .next/node_modules in the deployed copy ---"
ls -la .next/node_modules 2>&1 || true

echo "--- next start ---"
pnpm start
