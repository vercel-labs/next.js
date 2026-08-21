#!/usr/bin/env bash
# Reproduction for vercel/next.js#86478
# middleware-to-proxy codemod skips the middleware.ts -> proxy.ts rename
# when no content change was necessary.
set -u
cd "$(dirname "$0")"

run_case() {
  local dir="$1"
  local tmp
  tmp="$(mktemp -d)"
  cp -r "$dir"/. "$tmp"/
  (
    cd "$tmp"
    git init -q
    git add -A
    git -c user.email=r@example.com -c user.name=repro commit -qm init
    npx --yes @next/codemod@latest middleware-to-proxy . >/dev/null 2>&1
    echo "== $dir =="
    ls | grep -E '^(middleware|proxy)\.ts$'
  )
  rm -rf "$tmp"
}

run_case case-no-changes-needed
run_case case-changes-needed

echo
echo "Expected: both cases print proxy.ts"
echo "Actual:   case-no-changes-needed still prints middleware.ts"
