#!/usr/bin/env bash
# Follows the command printed on https://nextjs.org/docs/14/getting-started/installation
set -u
rm -rf v14-docs-app
npx --yes create-next-app@latest v14-docs-app \
  --ts --app --no-eslint --no-tailwind --no-src-dir --no-turbopack \
  --import-alias "@/*" --use-npm || exit 1

cd v14-docs-app || exit 1
NEXT_V=$(node -p "require('./node_modules/next/package.json').version")
REACT_V=$(node -p "require('./node_modules/react/package.json').version")
DOM_V=$(node -p "require('./node_modules/react-dom/package.json').version")
echo "installed next $NEXT_V react $REACT_V react-dom $DOM_V"

case "$NEXT_V" in
  14.*) echo "OK: docs/14 snippet installed Next 14"; exit 0 ;;
  *)    echo "FAIL: docs/14 install snippet produced next $NEXT_V (expected 14.x)"; exit 1 ;;
esac
