#!/bin/bash
# Reproduction for https://github.com/vercel/next.js/issues/20266
set -e
cd "$(dirname "$0")/nextjs-app"
npm install
# Simulate `yarn link local-module` / `npm link`: symlink a package that lives
# OUTSIDE the Next.js app directory and declares react as a peerDependency only.
rm -rf node_modules/local-module
ln -s ../../local-module node_modules/local-module
echo "--- next build --webpack (expect: Module not found: Can't resolve 'react') ---"
npx next build --webpack || true
echo "--- next build (turbopack) ---"
npx next build || true
