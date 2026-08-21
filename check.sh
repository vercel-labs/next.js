#!/bin/sh
# Issue #86944: patched Next.js versions still report pre-patch React canary
# version strings, even though the CVE-2025-55182 / CVE-2025-66478 fix in the
# vendored react-server-dom-* packages IS present.
#
# For each version we print:
#   1. the React version string baked into dist/compiled/next-server/app-page.runtime.prod.js
#   2. whether the RSC requireModule hasOwnProperty guard (the React fix) is present
set -e
WORK=${WORK:-/tmp/next86944}
rm -rf "$WORK"; mkdir -p "$WORK"; cd "$WORK"
for VERSION in "$@"; do
  rm -rf v && mkdir v && cd v
  npm pack "next@$VERSION" --silent >/dev/null
  tar -xzf "next-$VERSION.tgz"
  RUNTIME=package/dist/compiled/next-server/app-page.runtime.prod.js
  REACT_VERSION=$(grep -oE '19\.[0-9]+\.[0-9]+-[a-z]+-[a-f0-9]+-[0-9]+' "$RUNTIME" | sort -u | tr '\n' ' ')
  RSC=package/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.production.js
  if grep -q 'hasOwnProperty.call(moduleExports' "$RSC"; then FIX="present"; else FIX="MISSING"; fi
  if grep -qE '__esModule\?[A-Za-z$_.]+default:[A-Za-z$_]+:[A-Za-z$_]+\.call\(' "$RUNTIME"; then RFIX="present"; else RFIX="MISSING"; fi
  echo "next@$VERSION  react-version-string='$REACT_VERSION' rsc-fix(vendored)=$FIX rsc-fix(app-page.runtime.prod)=$RFIX"
  cd "$WORK"
done
