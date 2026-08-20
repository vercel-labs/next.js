#!/usr/bin/env bash
# Reproduction harness for https://github.com/vercel/next.js/issues/35542
# "Invalid casing detected for project dir" on Windows when the drive letter is lower case.
#
# Part A (any OS): executes the real next/dist/lib/get-project-dir.js from several Next.js
#   versions with Windows path/fs semantics simulated:
#     - path.resolve keeps the casing given by the shell ('c:\...')
#     - fs.realpathSync.native returns the canonical drive letter ('C:\...')
#     - fs.realpathSync (JS impl) keeps the given casing
# Part B (any OS): boots `next dev` against a project dir whose casing differs
#   (via a symlink) to prove the warning code path still exists in canary.
set -euo pipefail
cd "$(dirname "$0")"

echo "== Part A: simulated Windows drive letter =="
for v in 12.1.1 13.3.0 14.2.17 14.2.18 canary; do
  dir="tmp/next-$v"
  mkdir -p "$dir"
  [ -f "$dir/package.json" ] || echo '{"name":"t","private":true}' > "$dir/package.json"
  (cd "$dir" && npm i --silent --no-audit --no-fund --ignore-scripts "next@$v" >/dev/null)
  echo "--- next@$v"
  node windows-drive-letter-sim.js "$dir/node_modules/next" || true
done

echo
echo "== Part B: live next dev with mismatched project dir casing (canary) =="
mkdir -p tmp/app-canary/app
cd tmp/app-canary
[ -f package.json ] || echo '{"name":"app","private":true}' > package.json
npm i --silent --no-audit --no-fund next@canary react react-dom >/dev/null
printf 'export default function Page(){return <p>hi</p>}\n' > app/page.js
printf 'export default function L({children}){return <html><body>{children}</body></html>}\n' > app/layout.js
cd ..
ln -sfn app-canary App-Canary
cd app-canary
timeout 40 ./node_modules/.bin/next dev ../App-Canary --port 3114 2>&1 | head -20 || true
