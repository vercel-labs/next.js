# Repro: next#82451 — static export client-side nav breaks when `.txt` has no `Content-Type`

`output: 'export'` app served by a static server that returns the RSC payload
`.txt` files **without** a `Content-Type` header. The prefetch of `/about.txt`
succeeds (HTTP 200, correct body), but clicking `<Link prefetch>` performs a
full document reload instead of a client-side navigation, because
`fetch-server-response.ts` only accepts the response when
`content-type` starts with `text/plain`.

## Run

```bash
npm install
npx playwright install chromium
npm run build

# A: broken — .txt served with NO Content-Type
npm run serve:no-ct            # http://localhost:3000
BASE_URL=http://localhost:3000 npm test   # FAILS: full page reload

# B: control — same server, .txt served as text/plain
PORT=3001 npm run serve:with-ct
BASE_URL=http://localhost:3001 npm test   # PASSES: client-side navigation
```

The Playwright test sets `window.__SPA_MARKER` before clicking and checks that it
survives the navigation (soft nav) plus that the document was not re-created.

## Observed (next@15.5.4)

| case | prefetch | click result |
| --- | --- | --- |
| `.txt` without `Content-Type` | `GET /about.txt?_rsc=...` → 200 | hard reload: new document, `window.__SPA_MARKER` lost, `/index.txt` re-fetched |
| `.txt` as `text/plain` | `GET /about.txt?_rsc=...` → 200 | soft nav: same document, marker kept |

Only the response header differs between the two runs.

Source of the check:
https://github.com/vercel/next.js/blob/v15.5.4/packages/next/src/client/components/router-reducer/fetch-server-response.ts

## Note on next@16.3.1

With `next@16.3.1` the same app does not navigate at all in either case: the
navigation request goes to `/about?_rsc=...` (the `.txt` suffix is never
appended), receives HTML, and the click silently no-ops on the current page.
Set `"next": "16.3.1"` in package.json to see it.
