# Repro attempt: vercel/next.js#90669

`InvariantError: Invariant: Expected workUnitAsyncStorage to have a store.` when
`next/headers` is imported (transitively) from `next.config.ts` in a pnpm workspace
monorepo.

## Status: NOT reproduced

The reporter's reproduction branch
(`bigcommerce/catalyst@CATALYST-1791-upgrade-next`) has been deleted, so their exact
lockfile could not be run. This directory is the closest minimal harness plus the
diagnostics used to test the reporter's stated mechanism.

## Run

```bash
pnpm install
cd core && ./node_modules/.bin/next dev -p 3011
curl -s "http://localhost:3011/?a=1"
```

Observed: `GET /?a=1 200`, page prints `searchParams`, `headers().host` and the
workspace package's `headers().host`. No invariant error.

## What this harness contains

* pnpm workspace with `core` (the Next.js app) and `packages/lib` (a workspace
  package that `require`s `next/headers`).
* `core/next.config.ts` statically imports `core/client/index.ts`, which imports
  `next/headers` — the exact trigger described in the issue. Swap the import to
  `./client/config-client` for the reporter's "known good" variant.
* `packages/lib` pins `react`/`react-dom` `19.0.0` while `core` pins `19.1.5`, so pnpm
  materialises **two physically distinct copies** of `next@16.1.6` under
  `node_modules/.pnpm/`. This is the "two separate AsyncLocalStorage singletons"
  condition from the issue, and both copies do get instantiated during config
  resolution (see the `[CONFIG-PROBE]` output).
* `core/app/page.tsx` awaits `searchParams` — `next/dist/server/request/search-params.js`
  is one of the only three modules (`params.js`, `pathname.js`, `search-params.js`)
  that call `throwInvariantForMissingStore()`, i.e. where this error surfaces.

## Diagnostics observed with next@16.1.6 (Linux, Node 24.17.0, pnpm 10.12.4)

`[CONFIG-PROBE]` from `next.config.ts` shows config resolution runs in the *same pid*
as the dev server and that `require.cache` keys are always **real** paths
(`node_modules/.pnpm/...`), never the `core/node_modules/next/...` symlink path:

```
[CONFIG-PROBE] pid=2290
.../next@16.1.6_react-dom@19.1.5.../next/dist/server/app-render/work-unit-async-storage.external.js
.../next@16.1.6_react-dom@19.1.5.../next/dist/server/app-render/work-unit-async-storage-instance.js
.../next@16.1.6_react-dom@19.0.0.../next/dist/server/app-render/work-unit-async-storage.external.js
.../next@16.1.6_react-dom@19.0.0.../next/dist/server/app-render/work-unit-async-storage-instance.js
```

Even with two ALS singletons alive in the process, the render still resolves the
store and returns 200.

## Also tried (bigcommerce/catalyst @ main)

`bigcommerce/catalyst@main` already carries the workaround: `core/client/index.ts`
lazily `import()`s `next/headers`, `next/navigation` and `next-intl/server` with a
comment pointing at this issue. Reverting those three to static imports (and stubbing
only the network calls that need real BigCommerce credentials) reproduced neither on
`next@16.2.11` nor on `next@16.1.6`: `next/headers` is loaded during config
resolution (verified via the same probe), and `/` renders past `params`,
`searchParams` and `headers()` — it only fails on the outbound BigCommerce GraphQL
fetch, which needs credentials/network.

Suspected remaining differentiators: macOS (darwin) vs Linux, or the deleted
branch's exact lockfile producing a resolution shape this harness does not.
