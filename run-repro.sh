#!/bin/bash
# Reproduces webpack PackFileCacheStrategy ENOENT caching failures (next.js#60941)
# by letting an external agent rename/duplicate .next/cache/webpack pack files
# while next dev runs -- what iCloud Drive / Dropbox / OneDrive do to a project
# stored inside a synced folder.
set -u
ART=${ART:-./repro-logs}
mkdir -p "$ART"
LOG="$ART/${1:-dev-repro.log}"
stamp() { date +%T; }

rm -rf .next
echo "== phase 1: build a multi-pack warm cache =="
for s in 1 2 3; do
  node_modules/.bin/next dev > "$LOG.warm$s" 2>&1 &
  DEV=$!
  sleep 13
  for r in a b c d; do curl -s -o /dev/null http://localhost:3000/$r; done
  echo "export default function P(){return <h1>warm $s</h1>}" > app/d/page.js
  sleep 5; curl -s -o /dev/null http://localhost:3000/d; sleep 8
  kill "$DEV" 2>/dev/null; pkill -P "$DEV" 2>/dev/null; sleep 3
done
ls .next/cache/webpack/client-development

echo "== phase 2: start dev on the warm cache =="
node_modules/.bin/next dev > "$LOG" 2>&1 &
DEV=$!
until grep -q "Ready in" "$LOG"; do sleep 0.2; done

echo "$(stamp) == phase 3: external sync agent renames pack files to 'N 2.pack.gz' =="
(cd .next/cache/webpack && for d in client-development server-development; do
  for f in $d/[0-9].pack.gz; do mv "$f" "${f%.pack.gz} 2.pack.gz"; done
done)
ls .next/cache/webpack/client-development

echo "$(stamp) == phase 4: compile a route so webpack persists the cache again =="
curl -s -o /dev/null http://localhost:3000/h
sleep 5
echo "export default function P(){return <h1>trigger</h1>}" > app/e/page.js
sleep 3; curl -s -o /dev/null http://localhost:3000/e
sleep 20
kill "$DEV" 2>/dev/null; pkill -P "$DEV" 2>/dev/null; sleep 2
echo "== result =="
grep -n "Caching failed" -A8 "$LOG" | head -40
