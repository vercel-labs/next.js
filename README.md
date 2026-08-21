# Reproduction attempt for vercel/next.js#88501 — "Azure Maps Incompatible with Turbopack"

The reporter's link (`codesandbox.io/p/devbox/frosty-hooks-wvrgkm`) is not fetchable
(HTTP 403 behind a Cloudflare challenge) and its steps require the reader's own private
Azure Maps subscription key, so this is a minimal rebuild of the reported setup:
Next.js pages router + Turbopack + `azure-maps-control`, `output: 'export'` optional.

## Run

```bash
./verify.sh                       # install, build with Turbopack, syntax-check chunks, load in Chromium
# optional, to see real tiles instead of HTTP 401s:
NEXT_PUBLIC_AZURE_MAPS_KEY=<your key> ./verify.sh
```

`check.mjs <url> <tag>` loads a page in Chromium, reports `pageerror` / console errors and
whether `#map canvas` exists, and writes a screenshot.

Pages:

- `/` — `next/dynamic(..., { ssr: false })` wrapper around a component that statically
  imports `azure-maps-control` (the usual SSR-safe pattern).
- `/lazy` — `await import('azure-maps-control')` inside `useEffect`.

## Result: the reported failures did not reproduce

Matrix executed (all with Turbopack, pages router, react 18.3.1, node 24):

| next | mode | atlas chunk syntax-check | browser |
| --- | --- | --- | --- |
| 16.1.1 | `next dev` | n/a | map canvas created, no page errors |
| 16.1.1 | `next build` + `output: 'export'`, static serve | OK | map canvas created |
| 16.1.1 | `next build` + `next start` | OK | map canvas created |
| 16.3.1 | `next build` + `next start` | OK | map canvas created |

`azure-maps-control` 3.7.4, 3.6.0, 3.5.0, 3.4.0 and 3.3.0 were each built with
`next@16.1.1`; every emitted client chunk passed `node --check`, i.e. no
`SyntaxError: Identifier 'n' has already been declared`.

The only console output is `401` from `atlas.microsoft.com` because the placeholder
subscription key is not valid — the SDK itself initializes and creates its WebGL canvas.

In the produced bundle, `atlas-esm.min.js` and the app component are merged by Turbopack
into a single scope-hoisted module (one `TURBOPACK.push([...])` registration in the
~1.6 MB chunk) and the minifier renames correctly, which is exactly the place the reported
duplicate-declaration error would have to come from.

## Adjacent, reproducible detail

Importing `azure-maps-control` at the top level of a page (no `ssr: false`) makes
`next build` fail during "Collecting page data":

```
Error: Failed to load external module azure-maps-control-<hash>: ReferenceError: window is not defined
    at Context.externalRequire [as x] (.next/server/chunks/ssr/[turbopack]_runtime.js)
```

Turbopack externalizes the package for the server build; the SDK touches `window` at module
evaluation, so it must stay client-only. This is expected for this SDK, not the reported bug.

## What is still missing to reproduce the report

The exact page/component code from the devbox (and, if it matters, the reporter's
`azure-maps-control` version and any additional `azure-maps-*` plugin packages).
