#!/usr/bin/env bash
# usage: ./run.sh <next-version> <port>    e.g. ./run.sh 15.2.0 3020
set -e
V=${1:-15.2.0}; PORT=${2:-3000}
DIR="run-$V"
rm -rf "$DIR"; mkdir -p "$DIR"
cp -r app tsconfig.json gen.mjs "$DIR"/
cd "$DIR"
cat > package.json <<JSON
{ "name": "repro-$V", "private": true, "scripts": { "dev": "next dev --turbopack" },
  "dependencies": { "next": "$V", "react": "19.1.0", "react-dom": "19.1.0",
    "react-icons": "5.5.0", "date-fns": "4.1.0", "lodash": "4.17.21", "zod": "3.25.67",
    "@types/lodash": "4.17.20", "@types/node": "^22", "@types/react": "19.1.8", "typescript": "5.8.3" } }
JSON
node gen.mjs
pnpm i --ignore-scripts
( pnpm dev -p "$PORT" > dev.log 2>&1 & )
sleep 20
node ../measure.mjs "$PORT"
echo "--- dev.log compile lines ---"
grep -E "Compiled|Ready" dev.log || true
pkill -f "next de[v]" || true
