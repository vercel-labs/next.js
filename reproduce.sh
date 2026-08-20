#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/68690
#
# The bug is triggered at BUILD time, not by Docker: when the project root is
# the directory `/app` (which is what the official Next.js Dockerfile uses as
# WORKDIR) and the App Router contains a route segment named `app`
# (`app/app/page.tsx` -> route `/app`), the `/` route is compiled with the
# WRONG layout/page: it renders `app/app/{layout,page}.tsx` instead of
# `app/{layout,page}.tsx`, so the prerendered HTML has no <html>/<body> from the
# root layout. The browser then shows a blank page with React errors #418/#423
# and "HierarchyRequestError: Only one element on document allowed".
#
# Requires: root (to write to /app), node >= 18, npm.
set -euo pipefail

TARGET="${TARGET:-/app}"
SRC="$(cd "$(dirname "$0")" && pwd)"

echo "== copying reproduction to ${TARGET}"
rm -rf "${TARGET}"
mkdir -p "${TARGET}"
tar -C "${SRC}" --exclude=./node_modules --exclude=./.next --exclude=./.git -cf - . | tar -C "${TARGET}" -xf -

cd "${TARGET}"
echo "== npm install"
npm install --no-audit --no-fund >/dev/null
echo "== next version: $(node -p "require('next/package.json').version")"
echo "== next build (cwd=$(pwd))"
npm run build

HTML="${TARGET}/.next/server/app/index.html"
echo
echo "== prerendered HTML for the / route (${HTML}), first 200 bytes:"
head -c 200 "${HTML}"; echo
echo
if grep -q '<html' "${HTML}"; then
  echo "PASS: / contains the root layout (<html>) -- bug NOT reproduced"
  exit 0
fi
echo "FAIL (bug reproduced): / is missing the root layout <html> element."
grep -q 'My Next.js page' "${HTML}" \
  && echo "FAIL (bug reproduced): / rendered the /app route's page instead of app/page.tsx."
echo
echo "Control: the same build in a directory that is not /app works."
echo "  TARGET=/tmp/not-app bash reproduce.sh   # -> PASS"
echo "Control: renaming app/app to app/a while staying in /app also works."
exit 1
