#!/usr/bin/env bash
# Reproduction for vercel/next.js#97020
# Turbopack dev keeps deleted App Router manifests -> optional catch-all 404s until restart.
set -u
PORT=${PORT:-3000}
cd "$(dirname "$0")"

# reset to the initial file tree
rm -rf 'app/[locale]/project/[[...slug]]' .next
mkdir -p 'app/[locale]/project/[projectId]/home'
printf 'export default function ProjectPage() {\n  return <main>old localized project route</main>\n}\n' > 'app/[locale]/project/page.js'
printf 'export default function ProjectHomePage() {\n  return <main>old localized home route</main>\n}\n' > 'app/[locale]/project/[projectId]/home/page.js'

[ -d node_modules ] || npm install

./node_modules/.bin/next dev --turbopack -p "$PORT" > dev.log 2>&1 &
DEV_PID=$!
trap 'kill $DEV_PID 2>/dev/null' EXIT
sleep 12

echo "== before file-tree change =="
for p in /project /project/acme/home; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$p")"
done

# live file-tree change, dev server keeps running
rm -f 'app/[locale]/project/page.js' 'app/[locale]/project/[projectId]/home/page.js'
rm -rf 'app/[locale]/project/[projectId]'
mkdir -p 'app/[locale]/project/[[...slug]]'
printf 'export default function ProjectCatchAllPage() {\n  return <main>new localized project catch-all</main>\n}\n' > 'app/[locale]/project/[[...slug]]/page.js'
sleep 8

echo "== after file-tree change (expected 200, actual 404) =="
for p in /project /project/acme/home /project/acme/schedule /en/project/acme/schedule; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$p")"
done

echo "== .next/dev/server/app-paths-manifest.json (contains deleted routes) =="
cat .next/dev/server/app-paths-manifest.json; echo
echo "== dev server error =="
grep -m1 "same specificity" dev.log || echo "(none)"
