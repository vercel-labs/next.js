# Repro: Segment Explorer "Open in Editor" 404s in a monorepo (next.js#85695)

Minimal pnpm workspace (`apps/docs` is a Next.js app; the lockfile /
`pnpm-workspace.yaml` live at the repo root, so Turbopack infers the monorepo
root as the project root).

## Run

```bash
pnpm install
pnpm dev                 # next dev --port 3001 inside apps/docs
# in another shell:
pnpm exec playwright install chromium
pnpm verify              # drives the Segment Explorer and prints the request
```

Or manually: open http://localhost:3001, open Dev Tools -> Route Info, hover
`layout.tsx` and click the code icon.

## Observed (next@16.0.2-canary.4, the version pinned here)

```
404 http://localhost:3001/__nextjs_launch-editor?file=%2Fapps%2Fdocs%2Fapp%2Flayout.tsx&isAppRelativePath=1
```

The Segment Explorer renders the segment as `/ apps / docs / app` and sends a
path relative to the *monorepo root*, while the server joins it with `app/`
(see `middleware-turbopack.ts` `isAppRelativePath` branch), so the file is never
found.

## Expected / status

With `next@16.3.0` (and `16.3.1-canary.26`) the same steps in the same workspace
send `?file=layout.tsx&isAppRelativePath=1` and return `204`. Change the `next`
version in `apps/docs/package.json` to compare.
