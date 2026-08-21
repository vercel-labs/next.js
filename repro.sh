#!/usr/bin/env bash
# Offline harness: no Vercel login required.
set -u
ROOT="$(cd "$(dirname "$0")" && pwd)"
VC="npx --yes vercel@50.4.0"
PROJECT='{"projectId":"prj_offline_test","orgId":"team_offline_test","settings":{"framework":"nextjs","rootDirectory":"apps/frontend","buildCommand":null,"outputDirectory":null,"installCommand":null,"devCommand":null,"nodeVersion":"22.x","createdAt":0,"skipGitConnectDuringLink":true}}'

echo "== 1. plain next build --turbopack in apps/frontend =="
(cd "$ROOT/apps/frontend" && npx next build --turbopack); echo "exit=$?"

echo "== 2. vercel build inside apps/frontend (Root Directory = apps/frontend) =="
rm -rf "$ROOT/.vercel"; mkdir -p "$ROOT/apps/frontend/.vercel"
printf '%s' "$PROJECT" > "$ROOT/apps/frontend/.vercel/project.json"
(cd "$ROOT/apps/frontend" && $VC build --yes); echo "exit=$?  # expect ENOENT .../apps/frontend/apps/frontend/package.json"

echo "== 3. vercel build from monorepo root =="
rm -rf "$ROOT/apps/frontend/.vercel"; mkdir -p "$ROOT/.vercel"
printf '%s' "$PROJECT" > "$ROOT/.vercel/project.json"
(cd "$ROOT" && $VC build --yes); echo "exit=$?  # expect success"
