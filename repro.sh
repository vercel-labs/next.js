#!/usr/bin/env bash
# Demonstrates that the NEXT_LOCALE cookie is ignored when i18n domain routing
# is configured: Next.js redirects across domains purely from Accept-Language.
# Start the server first:  npm run dev   (or npm run build && npm start)
set -u
PORT="${PORT:-3000}"
probe() {
  printf '\n--- Host: %-11s Accept-Language: %-16s NEXT_LOCALE cookie: %s\n' "$1" "${2:-<none>}" "${3:-<none>}"
  curl -s -o /dev/null -D - -H "Host: $1" ${2:+-H "Accept-Language: $2"} \
    ${3:+-H "Cookie: NEXT_LOCALE=$3"} "http://localhost:$PORT/" | grep -Ei '^(HTTP|location)'
}
probe example.ca ""               ""
probe example.ca "en-US,en;q=0.9" ""
probe example.ca "en-US,en;q=0.9" "en-CA"   # cookie says stay -> still redirected to example.co
probe example.co "en-CA,en;q=0.9" "en-US"   # cookie says stay -> still redirected to example.ca
