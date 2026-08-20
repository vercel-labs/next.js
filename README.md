# Reproduction — vercel/next.js#53562

`export const runtime = 'edge'` + webpack dev + a **pnpm/turborepo workspace on Windows**
fails to render, because the client-reference manifest's `edgeSSRModuleMapping` is empty:

```
⨯ Error: Could not find the module "(app-pages-browser)/../../node_modules/.pnpm/next@.../next/dist/lib/framework/boundary-components.js"
  in the React Server Consumer Manifest. This is probably a bug in the React Server Components bundler.
GET / 500
```

On older versions React reported the same failure as
`TypeError: Cannot read properties of undefined (reading '')`.

## Layout

Minimal pnpm workspace, one app:

- `pnpm-workspace.yaml` → `apps/*` (so `next` is hoisted to the **repo root**, outside the app)
- `apps/web/app/page.js` → `export const runtime = 'edge'`, renders a `'use client'` component

## Run it

### On Windows (the reported environment)

```bash
pnpm install
pnpm --filter web exec next dev --webpack   # Next 16 defaults to Turbopack, which is unaffected
# open http://localhost:3000  -> 500, server logs the manifest error above
```

Turbopack (`next dev`) and a non-monorepo app on the same machine both work — that matches
the workarounds people report in the issue thread.

### On Linux / macOS (Windows path emulation)

The bug is caused purely by Windows path separators, so it cannot happen natively on POSIX.
This repo ships a script that makes the *installed* Next.js compute manifest keys exactly the
way it does on Windows (`path.relative` → `path.win32.relative`, two call sites, nothing else):

```bash
pnpm install
pnpm --filter web exec next dev --webpack   # control: http://localhost:3000 -> 200 OK
node scripts/emulate-windows-paths.mjs
rm -rf apps/web/.next
pnpm --filter web exec next dev --webpack   # http://localhost:3000 -> 500 + manifest error
```

Observed with `next@16.3.1-canary.24`:

| run | `edgeSSRModuleMapping` entries | HTTP |
| --- | --- | --- |
| unpatched (POSIX separators) | 20 | 200 |
| win32 separators emulated | 1 | 500 |

## Root cause

Two places compute the same key for `pluginState.edgeSsrModules`:

- `build/webpack/plugins/flight-client-entry-plugin.ts`
  ```ts
  let ssrNamedModuleId = path.relative(compiler.context, modResource)
  if (!ssrNamedModuleId.startsWith('.')) {
    ssrNamedModuleId = `./${normalizePathSep(ssrNamedModuleId)}` // ← only normalized here
  }
  pluginState.edgeSsrModules[
    ssrNamedModuleId.replace(/\/next\/dist\/esm\//, '/next/dist/') // ← forward slashes only
  ] = moduleInfo
  ```
- `build/webpack/plugins/flight-manifest-plugin.ts` reads
  `pluginState.edgeSsrModules[ssrNamedModuleId]` to fill `edgeSSRModuleMapping`.

In a monorepo, `next` lives above the app dir, so `path.relative()` returns
`..\..\node_modules\...` — it starts with `.`, so `normalizePathSep()` is skipped and the
separators stay backslashes. The `/next/dist/esm/` → `/next/dist/` rewrite (written with
forward slashes) then never matches, the lookup misses, `edgeSSRModuleMapping` stays empty and
React cannot resolve any client reference in the edge SSR runtime.

In a single-package app the relative path is `node_modules\next\...` (no leading `.`), so it
*is* normalized to forward slashes and everything matches — which is why the bug is
monorepo-only, and POSIX hosts are never affected.
