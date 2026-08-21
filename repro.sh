#!/bin/bash
# Reproduces vercel/next.js#82625 without Docker by putting the *same* project
# either at the filesystem root ("no WORKDIR" in a container) or under /app
# ("WORKDIR /app"). It prints the duration of the `node-file-trace-build` span
# ("Collecting build traces ...") taken from .next/trace.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"

run() {
  ROOT="$1" # / or /app
  echo "=== building with project root at ${ROOT} ==="
  mkdir -p "${ROOT}"
  cp "${HERE}/package.json" "${ROOT}/"
  rm -rf "${ROOT}/src"; cp -r "${HERE}/src" "${ROOT}/src"
  ( cd "${ROOT}" && npx --yes pnpm@10 install --prod --silent )
  ( cd "${ROOT}/src" && rm -rf .next && NEXT_TELEMETRY_DISABLED=1 npx next build )
  node -e '
    const fs = require("fs")
    const file = process.argv[1]
    for (const line of fs.readFileSync(file, "utf8").trim().split("\n"))
      for (const span of JSON.parse(line))
        if (span.name === "node-file-trace-build")
          console.log("Collecting build traces (node-file-trace-build):", (span.duration / 1e6).toFixed(2) + "s")
  ' "${ROOT}/src/.next/trace"
}

roots=("$@")
if [ ${#roots[@]} -eq 0 ]; then roots=(/ /app); fi
for root in "${roots[@]}"; do run "$root"; done
