#!/usr/bin/env bash
# Reproduces vercel/next.js#97980: `next upgrade` crashes with `spawn npx ENOENT`.
#
# On Windows, `npx`/`pnpm`/`yarn` exist only as `npx.cmd` / `npx.ps1` shims, so
# child_process.spawn('npx', ...) without a shell (or cross-spawn) fails with ENOENT,
# and next-upgrade.ts registers no 'error' listener -> unhandled 'error' event.
#
# This script recreates the exact same condition on any OS by pointing PATH at a
# directory that only contains `npx.cmd` (no extension-less `npx`), exactly like Windows.
set -u
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --no-audit --no-fund
NODE_BIN="$(command -v node)"
PATH=./fakewinbin "$NODE_BIN" node_modules/next/dist/bin/next upgrade
echo "exit code: $?"
