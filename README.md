# Repro: tree shaking in middleware doesn't work (vercel/next.js#75180)

`src/middleware.ts` imports only `COOKIE_NAME` from `src/i18n.ts`. The unused
`getMessages()` export in the same module dynamically imports
`../messages/${locale}.json`, and those JSON files end up in the middleware
(proxy) bundle anyway.

## Run

```bash
npm install
npm run build
# Turbopack (default): unused message JSON chunks are listed for the middleware entry
cat .next/server/middleware-manifest.json | grep messages

npm run build:webpack
# webpack: message JSON is inlined into the middleware bundle
grep -c UNIQUE_MARKER_STRING_1999 .next/server/src/middleware.js
ls -la .next/server/src/middleware.js
```

## Observed

- Turbopack build: `middleware-manifest.json` lists
  `server/edge/chunks/messages_en_json_...js` and `..._es_json_...js` in the
  middleware entry `files`.
- webpack build (`--webpack`): `.next/server/src/middleware.js` is ~297 kB and
  contains the JSON payload (`UNIQUE_MARKER_STRING_*`).
- Originally reported on 15.1.5 (middleware reported as 1.07 MB with the
  reporter's 2.5 MB message files); still present on next@canary.

## Expected

`getMessages` is never referenced from the middleware, so it and the message
JSON should be tree shaken out of the middleware bundle.
