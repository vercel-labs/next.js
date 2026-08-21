#!/usr/bin/env bash
# Reproduces vercel/next.js#87686 on Next 16.1.1 (Turbopack)
set -e
cd "$(dirname "$0")"
npm install
npx next build
echo "--- .next/node_modules after build ---"
ls -la .next/node_modules

# Simulate a deploy that copies .next without preserving symlinks
# (FTP/GUI upload, docker COPY of selected dirs, plain artifact copy, ...)
rm -rf /tmp/deploy-87686
mkdir -p /tmp/deploy-87686
cp package.json /tmp/deploy-87686/
cp -r pages /tmp/deploy-87686/
cp -r .next /tmp/deploy-87686/.next
rm -rf /tmp/deploy-87686/.next/node_modules   # symlink lost in transfer
cd /tmp/deploy-87686
npm install --omit=dev
npx next start -p 3002 > /tmp/deploy-87686.log 2>&1 &
sleep 8
echo "HTTP status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3002/)"
grep -m1 "Failed to load external module" /tmp/deploy-87686.log || echo "no error - not reproduced"
