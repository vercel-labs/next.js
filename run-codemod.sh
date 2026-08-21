#!/usr/bin/env bash
set -euo pipefail
# Shows that @next/codemod@latest resolves and runs the codemod that docs pin to @canary.
tmp=$(mktemp -d)/proj
mkdir -p "$tmp/app"
cd "$tmp"
cat > package.json <<'JSON'
{
  "name": "codemod-tag-check",
  "private": true,
  "scripts": { "lint": "next lint" },
  "dependencies": { "next": "16.0.0", "react": "19.2.0", "react-dom": "19.2.0" }
}
JSON
echo 'export default function Page(){return <h1>hi</h1>}' > app/page.tsx
echo "@next/codemod@latest = $(npm view @next/codemod@latest version)"
echo "@next/codemod@canary = $(npm view @next/codemod@canary version)"
npx --yes @next/codemod@latest next-lint-to-eslint-cli . --force
echo "--- resulting package.json ---"; cat package.json
echo "--- eslint.config.mjs exists? ---"; ls eslint.config.mjs
