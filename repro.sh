#!/usr/bin/env bash
# Cold `next build` N times, reporting pass/fail per run.
# The failure is a race, so a single green run proves nothing — run at least 5.
set -u
RUNS="${1:-5}"
pass=0
fail=0

for i in $(seq 1 "$RUNS"); do
  rm -rf .next
  out=$(npm run build 2>&1)
  if printf '%s' "$out" | grep -q '__turbopack_context__.a is not a function'; then
    fail=$((fail + 1))
    echo "run $i: FAIL"
  else
    pass=$((pass + 1))
    n=$(grep -c asyncModule '.next/build/chunks/[turbopack]_runtime.js' 2>/dev/null || echo 0)
    echo "run $i: pass (asyncModule occurrences in runtime: $n)"
  fi
done

echo "---"
echo "pass: $pass  fail: $fail  (out of $RUNS)"
