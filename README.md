# Repro: basePath breaks RSC segment-cache prefetch on Vercel (next 16.0.x / 16.1.x)

Minimal reproduction for https://github.com/vercel/next.js/issues/86284
(the reporter's repo `Heet-Bhalodiya/mui-next-test` and its deployment are no longer public).

## App

- `next.config.js`: `{ basePath: '/test' }`
- `app/[lang]/layout.jsx`: root layout calls `await cookies()` (theme persistence) and renders two `<Link>`s
- `app/[lang]/page.jsx`, `app/[lang]/other/page.jsx`

## Steps

```bash
npm install
npm run build
# deploy this directory to Vercel (the bug only appears in minimal/deployed mode,
# `next start` locally returns 200)
./verify.sh https://<deployment-url>
```

Then open `https://<deployment-url>/test/en` in a browser with devtools open and click "other".

## Observed (next@16.1.7, also next@16.0.11)

Every client prefetch / navigation request to `/test/<lang>[/<page>]?_rsc=...`
carrying `Next-Router-Segment-Prefetch: /_tree` returns **HTTP 404** with
`content-type: text/x-component`, producing repeated
`Failed to load resource: the server responded with a status of 404`
console errors and disabling client-side RSC navigation (it falls back to a full
browser navigation). Plain document and non-segment RSC requests return 200.

## Expected

`404` -> `200`, no console errors. Verified working when any one of these changes:

| variant | tree prefetch |
| --- | --- |
| next 16.0.11 + `basePath` | **404** |
| next 16.1.7 + `basePath` | **404** |
| next 16.0.11, `basePath` removed | 200 |
| next 16.0.11 + `basePath`, `cookies()` removed | **404** |
| next 16.2.12 / 16.3.1 + `basePath` | 200 |

So the trigger is `basePath` + deployed (minimal-mode) segment-cache prefetching,
not `cookies()`; it is already fixed on 16.2.12+.
