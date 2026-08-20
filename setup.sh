#!/bin/bash
# Reproduces https://github.com/vercel/next.js/issues/50391
set -e
cd "$(dirname "$0")"
(cd lib && pnpm install)                 # linked lib gets its own react copy (devDependency)
(cd app && pnpm install && pnpm link ../lib)
echo "Now run: cd app && pnpm dev   -> open http://localhost:3000 and check the browser console"
