# Repro: next.js#78985 — Server Action hangs when called via setTimeout(0) right after router.push in `next dev`

## Run
```
npm install
npm run dev   # open http://localhost:3000/page1 and click "to page2"
```
`#status` on /page2 stays `pending` forever in dev.
With `npm run build && npm start` it becomes `resolved:<timestamp>` and the URL updates to `/page2?asdf`.

Automated check (requires `npx playwright install chromium`):
```
node test.mjs http://localhost:3000
```
Prints `FINAL STATUS: pending` (bug) vs `FINAL STATUS: resolved:...` (ok).

## Results
| next | mode | result |
|---|---|---|
| 15.4.0-canary.28 (reported) | dev | pending (hangs, 3/3 runs) |
| 15.4.0-canary.28 | build+start | resolved |
| 15.5.23 | dev | pending (hangs) |
| 16.3.1-canary.26 | dev | resolved (appears fixed) |

Notes: while hanging, the browser never issues the Server Action POST at all, and the
`router.push('?asdf')` URL change is never committed (URL stays `/page2`), although the
`/page2?asdf&_rsc=...` navigation requests return 200.
