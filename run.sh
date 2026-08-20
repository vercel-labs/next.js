#!/bin/bash
# Builds the same "export default function Home() { return null }" pages app
# against several Next.js versions and prints gzipped first-load JS for each.
set -u
for v in 13.4.19 13.5.2 13.5.4 13.5.6 latest canary; do
  (cd "$v" && rm -rf node_modules .next package-lock.json && npm install --no-audit --no-fund >/dev/null 2>&1 && npm run build > ../build-$v.log 2>&1)
  echo "=== next@$(node -p "require('./$v/node_modules/next/package.json').version")"
  node measure.mjs "$v" | tail -1
done
