#!/usr/bin/env bash
# Reproduces vercel/next.js#79550: create-next-app aborts when a .github directory exists.
set -u
rm -rf myapp
mkdir -p myapp/.github/prompts
echo "install next.js with create-next-app" > myapp/.github/prompts/next.prompt.md
npx --yes create-next-app@canary myapp \
  --ts --app --no-eslint --no-tailwind --no-src-dir --no-import-alias --use-npm --yes
echo "exit code: $?"
