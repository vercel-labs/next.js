#!/usr/bin/env bash
# Reproduces https://github.com/vercel/next.js/issues/65630 (webpack builds).
# The webpack barrel-file transform for experimental.optimizePackageImports
# caches ui/index.ts on disk in .next, so a rename of ui/Button.tsx keeps
# failing with "Module not found: Can't resolve './Button'" until .next is deleted.
set -u
BUNDLER_FLAG="--webpack"   # pass "turbopack" as $1 to run without --webpack
[ "${1:-}" = "turbopack" ] && BUNDLER_FLAG=""

rm -rf .next
git checkout -- ui 2>/dev/null || true

echo "== build 1 (clean, ui/Button.tsx) =="
npx next build $BUNDLER_FLAG > build1.log 2>&1
echo "build 1 exit: $?"

echo "== rename ui/Button.tsx -> ui/CounterButton.tsx and update the barrel =="
mv ui/Button.tsx ui/CounterButton.tsx
printf '%s\n' '// Barrel file for the local "@/ui" package.' 'export { Button } from "./CounterButton";' > ui/index.ts
grep -r "CounterButton" ui

echo "== build 2 (incremental, should succeed) =="
npx next build $BUNDLER_FLAG > build2.log 2>&1
CODE2=$?
echo "build 2 exit: $CODE2"
grep -E "Can't resolve|Failed to compile" build2.log || true

echo "== build 3 after rm -rf .next (proves it is a cache) =="
rm -rf .next
npx next build $BUNDLER_FLAG > build3.log 2>&1
echo "build 3 exit: $?"

# restore
mv ui/CounterButton.tsx ui/Button.tsx
printf '%s\n' '// Barrel file for the local "@/ui" package.' 'export { Button } from "./Button";' > ui/index.ts

if [ "$CODE2" -ne 0 ]; then
  echo "REPRODUCED: build 2 failed from the stale cached barrel file, build 3 (fresh .next) passed."
else
  echo "NOT REPRODUCED: build 2 succeeded."
fi
