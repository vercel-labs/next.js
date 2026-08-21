# Repro harness for vercel/next.js#89530 — "Excessive Fast Refresh rebuilds when dev server runs on Bun runtime"

Automated counter of `[Fast Refresh] rebuilding` / `[Fast Refresh] done in …` console pairs per file save,
used to compare the Bun runtime against Node for the reporter's app
(https://github.com/MrScotch679/NextBunFastRefresh, commit 038d8e592df679c14a4c47cdf930dd399aef638e).

## Usage

```bash
git clone https://github.com/MrScotch679/NextBunFastRefresh.git app
cd app && bun install
# in this harness dir:
npm i && npx playwright install chromium --with-deps
# paths inside run.mjs assume the app is at /workspace/repro — adjust APP dir constants if needed
node run.mjs bun-turbopack  "bun --bun ./node_modules/next/dist/bin/next dev --turbopack --port 3000" 3000
node run.mjs node-turbopack "node ./node_modules/next/dist/bin/next dev --turbopack --port 3003" 3003
```

The harness starts the dev server, loads `/en`, waits for the app to settle, then appends a comment to
`app/[locale]/page.tsx` (or a file passed as argv[5]) four times with 20s between saves, counting Fast Refresh
console messages per save. Results are written to `<label>-results.json`.

## Measured results (Linux x64, Node 24.17.0, next 16.2.0-canary.28)

| run | rebuilding pairs per save (edits 1..4) |
| --- | --- |
| `bun --bun` + Turbopack (bun 1.4.0) | 3, 1, 1, 1 |
| `bun --bun` + Turbopack (bun 1.4.0, client component edit) | 1, 1, 1, 1 |
| `bun --bun` + Turbopack (bun 1.3.11) | 2, 2, 1, 2 |
| `node` + Turbopack (control) | 2, 1, 1, 1 |

The dev server really does run on Bun (`ps` shows `bun --bun .../server/lib/start-server.js`).
On Linux the Node control shows the same duplicated pair on the first save as Bun, and no growth over the
session, so the reported Bun-only 5+ pairs per save did not reproduce here. The report is from Windows 11,
which suggests the duplicate-watch-event path is platform specific.
