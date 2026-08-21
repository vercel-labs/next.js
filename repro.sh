#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/84450
# Extraneous @emnapi/* / @napi-rs/wasm-runtime packages after a clean install
# of the create-next-app dependency set (next + tailwind v4 + eslint-config-next).
#
# The behavior depends on the npm version: npm 10.x hoists the wasm32 optional
# deps to the project root, npm 11.x does not.
set -u
rm -rf node_modules package-lock.json

echo "== npm 10.9.2 =="
npx --yes npm@10.9.2 install --silent
npx --yes npm@10.9.2 ls

rm -rf node_modules package-lock.json
echo "== npm 11.13.0 =="
npx --yes npm@11.13.0 install --silent
npx --yes npm@11.13.0 ls
