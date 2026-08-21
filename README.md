# Repro: Next 16.2.0 standalone output is not relocatable when `serverExternalPackages` is used

Minimal reproduction of https://github.com/vercel/next.js/issues/91654.

pnpm workspace + `turbo prune` (the usual Docker build flow), `output: 'standalone'`,
`serverExternalPackages: ['@opentelemetry/instrumentation']` and an `instrumentation.ts`
that imports that package.

## Run

```sh
sh repro.sh
```

## Expected

`HTTP 200`.

## Actual (next@16.2.0, Turbopack build)

```
Failed to prepare server Error: An error occurred while loading instrumentation hook:
Failed to load external module @opentelemetry/instrumentation-3d481a11c97e801b:
Error: Cannot find module '@opentelemetry/instrumentation-3d481a11c97e801b'
```
and `HTTP 500`.

## Why

The Turbopack build writes hashed aliases for `serverExternalPackages` into
`apps/test-app/.next/node_modules/@opentelemetry/instrumentation-<hash>` as *relative symlinks*.
With `turbo prune`, 16.2.0 puts the standalone tree one directory deeper
(`.next/standalone/out/apps/test-app/...` instead of `.next/standalone/apps/test-app/...`)
and the symlinks are written relative to the *parent* of the standalone root
(`../../../../../../out/node_modules/.pnpm/...`).

Copying `.next/standalone/out/.` into the image root (what the docs' Dockerfile does)
therefore breaks every one of those symlinks. Copying `.next/node_modules` in addition
does not help because the link targets themselves point outside the copied tree.

next@16.1.7 produced `.next/standalone/apps/test-app/...` with `../../../../../node_modules/...`
links that stay inside the copied tree, and the same Docker copy works (`HTTP 200`).

Workarounds: copy `.next/standalone/.` (keeping the extra `out/` level) and run
`node out/apps/test-app/server.js`, or set `turbopack.root` to the pruned workspace root.
