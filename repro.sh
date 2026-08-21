#!/usr/bin/env bash
# Reproduces: build-time custom deploymentId is replaced at runtime by the
# platform-injected dpl_ ID, so the ID handed to clients cannot be pinned by
# prebuilt Skew Protection.
set -euo pipefail
PORT="${PORT:-3100}"
BUILD_ID="${BUILD_ID:-custom-old}"                 # what `vercel build` was given
RUNTIME_ID="${RUNTIME_ID:-dpl_RuntimeInjectedId}"  # what Vercel injects at runtime

rm -rf .next
# `vercel build` sets NOW_BUILDER=1 -> ciEnvironment.hasNextSupport === true
NOW_BUILDER=1 NEXT_DEPLOYMENT_ID="$BUILD_ID" npx next build

echo "--- build output ---"
node -e "console.log('routes-manifest.deploymentId =', require('./.next/routes-manifest.json').deploymentId)"
node -e "const c=require('./.next/required-server-files.json').config;console.log('config.deploymentId       =', JSON.stringify(c.deploymentId));console.log('experimental.runtimeServerDeploymentId =', c.experimental.runtimeServerDeploymentId)"

cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
NEXT_DEPLOYMENT_ID="$RUNTIME_ID" PORT="$PORT" node .next/standalone/server.js > server.log 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
for i in $(seq 1 30); do curl -sf -m 2 "http://127.0.0.1:$PORT/" -o /tmp/repro.html && break; sleep 1; done

echo "--- served HTML ---"
grep -o 'data-dpl-id="[^"]*"' /tmp/repro.html | head -1
grep -o 'dpl=[^"&]*' /tmp/repro.html | head -1
grep -o 'id="runtime-deployment-id">[^<]*' /tmp/repro.html
