# Repro: next.js#58556 — docs i18n middleware example throws "Incorrect locale information provided"

The `getLocale` snippet in the App Router internationalization docs passes
`NextRequest#headers` (a WHATWG `Headers` instance) straight into `new Negotiator({ headers })`.
Negotiator expects a plain object, so `.languages()` returns `["*"]` and
`@formatjs/intl-localematcher`'s `match()` throws `RangeError: Incorrect locale information provided`.

## Run

```bash
npm install
npm run dev            # dev server on :3000
curl -i -H 'accept-language: en-US,en;q=0.5' http://localhost:3000/products
```

Expected (per docs): 307 redirect to `/en/products`.
Actual: HTTP 500 and server log:

```
[repro] negotiator languages = ["*"]
⨯ Error [RangeError]: Incorrect locale information provided
    at getLocale (getLocale.js:10:15)
    at middleware (middleware.js:12:27)
```

`node node-check.mjs` isolates the same behavior without a server:

```
Headers instance -> ["*"]
match() threw: Incorrect locale information provided
plain object -> ["en-US","en"]
```

Fix used by `examples/app-dir-i18n-routing/middleware.ts`: copy headers into a plain object first.
