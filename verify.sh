#!/usr/bin/env bash
# Prints loadEnvConfig().loadedEnvFiles from next.config.ts on several Next.js versions.
set -u
for v in 15.2.2 15.2.2-canary.7 15.3.0-canary.10; do
  echo "=== next@$v ==="
  rm -rf node_modules package-lock.json .next
  npm install "next@$v" --no-audit --no-fund >/dev/null 2>&1
  timeout 60 npx next dev -p 3123 2>&1 | sed -n '1,12p'
done
