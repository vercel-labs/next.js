#!/usr/bin/env bash
# Reproduction for vercel/next.js#79562
# Docs page for `output` in the next.config.js reference never documents `output: 'export'`,
# even though the config schema accepts 'standalone' | 'export'.
set -u
DOC_MDX="https://raw.githubusercontent.com/vercel/next.js/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/output.mdx"
SCHEMA="https://raw.githubusercontent.com/vercel/next.js/canary/packages/next/src/server/config-schema.ts"
LIVE="https://nextjs.org/docs/app/api-reference/config/next-config-js/output"

echo "== config schema accepted values for \`output\` =="
curl -sfL "$SCHEMA" | grep -n "output: z.enum" || echo "NOT FOUND"

echo
echo "== docs source mentions of output values =="
doc="$(curl -sfL "$DOC_MDX")"
echo "standalone occurrences: $(printf '%s' "$doc" | grep -c "output: 'standalone'")"
echo "export occurrences:     $(printf '%s' "$doc" | grep -c "output: 'export'")"

echo
echo "== published docs page mentions of output values =="
live="$(curl -sfL "$LIVE")"
echo "'standalone' word occurrences: $(printf '%s' "$live" | grep -o "standalone" | wc -l)"
echo "\"output:\" + export occurrences: $(printf '%s' "$live" | grep -o "output:[^<]\{0,20\}export" | wc -l)"

echo
if printf '%s' "$doc" | grep -q "output: 'export'"; then
  echo "RESULT: docs mention output: 'export' -> issue NOT reproduced"
  exit 1
else
  echo "RESULT: docs never mention output: 'export' -> issue reproduced"
fi
