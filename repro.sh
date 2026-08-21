#!/usr/bin/env bash
# Reproduces vercel/next.js#83288: `next start` in a production-only install
# (devDependencies pruned, as on Azure Static Web Apps / Oryx) tries to npm-install
# TypeScript just to load next.config.ts, so the server never becomes ready.
set -x
npm install
npm run build
# what the hosting platform does with the built app:
npm prune --omit=dev
# no outbound npm registry (sealed runtime container):
npm_config_registry=http://10.255.255.1:80/ npx next start -p 3114 &
sleep 45
curl -s -o /dev/null -w "http_status=%{http_code}\n" --max-time 5 http://localhost:3114/
