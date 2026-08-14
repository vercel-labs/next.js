#!/usr/bin/env bash
# Reproduces vercel/next.js#97347
set -x
npm install --no-audit --no-fund
git init -q 2>/dev/null; git add -A; git -c user.email=a@b -c user.name=r commit -qm init
npx --yes @next/codemod@canary next-lint-to-eslint-cli .
echo "--- generated eslint.config.mjs ---"; cat eslint.config.mjs
echo "--- installed eslint-config-next version ---"; node -p "require('eslint-config-next/package.json').version"
echo "--- npm run lint (expected: ERR_MODULE_NOT_FOUND) ---"; npm run lint
