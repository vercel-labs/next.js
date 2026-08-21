# Repro: `"use cache"` components don't HMR inside a cross-site iframe

Upstream issue: https://github.com/vercel/next.js/issues/90143

## Setup

```bash
npm install
npx playwright install chromium
npm run dev    # Next dev server on http://localhost:3000
npm run host   # plain host page on http://127.0.0.1:8080 that iframes it
npm run verify # Playwright: edits app/page.tsx, compares direct page vs iframe
```

`localhost` and `127.0.0.1` are different sites, so the iframe is a cross-site
(third-party) context — the same situation as embedding a tunnelled dev server.

## Result with `next@16.2.0-canary.50` (version from the issue report)

```
initial direct : VALUE_1
initial iframe : VALUE_1
after edit direct : {"ok":true,"text":"VALUE_2","ms":507}
after edit iframe : {"ok":false,"text":"VALUE_1","ms":25255}
cookies: [{"name":"__next_hmr_refresh_hash__","value":"6","domain":"localhost",
           "path":"/","sameSite":"Lax"}]
iframe after reload : VALUE_1
```

The dev HMR refresh hash is carried by the `__next_hmr_refresh_hash__` cookie,
which is `SameSite=Lax`, so it is never sent from a cross-site iframe. The
server keeps serving the stale `use cache` entry there.

## Fixed on current releases

Same script against `next@16.3.1` and `next@16.3.1-canary.26`: the iframe
updates (no `__next_hmr_refresh_hash__` cookie is set at all any more), i.e.
the cookie-based mechanism was replaced upstream (see PR #96022). Change the
`next` dependency to `16.3.1` and re-run `npm run verify` to confirm.
