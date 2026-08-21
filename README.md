# Repro: vercel/next.js#95447

An unknown `multipart/form-data` POST (no `Next-Action` header, so it is treated as an
MPA/progressive-enhancement Server Action) sent to a route that 404s returns
**500 in production** (`next build && next start`) but **404 in development**
(`next dev`), when the app has at least one registered Server Action.

```bash
npm install
npm run verify
```

Observed with `next@16.3.1-canary.26` (also `next@16.2.9`):

```
--- next dev ---
multipart POST /customer/address_file/upload -> 404   (x-nextjs-action-not-found: 1, "Server action not found.")
json POST      /customer/x                   -> 404
GET            /customer/x                   -> 404
multipart POST after visiting / in dev       -> 500
--- next start (production) ---
multipart POST /customer/address_file/upload -> 500   ("Internal Server Error")
json POST      /customer/x                   -> 404
GET            /customer/x                   -> 404
```

Server log in both modes for the failing request:

```
⨯ Error: Failed to find Server Action. This request might be from an older or newer deployment.
```

Notes:

- `app/actions.ts` is the precondition. With zero Server Actions, `!hasServerActions()`
  short-circuits to `handleUnrecognizedFetchAction` (graceful 404) in both modes.
- In dev the response is 404 only until the client reference/action manifest actually
  contains the action; after loading `/` (which registers `noop`), dev 500s too.
  Production always 500s because the manifest is complete from the first request.
- Source: `packages/next/src/server/app-render/action-handler.ts` — the bare
  `throw new Error('Failed to find Server Action...')` when
  `areAllActionIdsValid(formData, serverModuleMap) === false` for a non-fetch
  multipart action POST.
