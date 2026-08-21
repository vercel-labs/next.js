#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/91954
# create-next-app writes a pnpm-workspace.yaml without a `packages` field for
# every pnpm v10.x, but pnpm only made that field optional in 10.5.0.
set -u
PNPM_VERSION="${PNPM_VERSION:-10.4.1}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
WORK="$(mktemp -d)"
echo "== installing pnpm@${PNPM_VERSION} into ${WORK}/tools"
mkdir -p "$WORK/tools" && (cd "$WORK/tools" && npm i --silent --no-audit --no-fund "pnpm@${PNPM_VERSION}")
export PATH="$WORK/tools/node_modules/.bin:$PATH"
echo "== pnpm version: $(pnpm --version)"

echo "== scaffolding with create-next-app@latest (pnpm is the package manager)"
mkdir -p "$WORK/app" && cd "$WORK/app"
pnpm dlx create-next-app@latest my-app \
  --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" \
  --use-pnpm --skip-install --yes

echo "== generated pnpm-workspace.yaml"
cat my-app/pnpm-workspace.yaml

echo "== running \`pnpm i\` (expected to fail)"
cd my-app && pnpm i
echo "== pnpm i exit code: $?"
