# Repro: next#95450 — standalone output contains symlinks resolving outside `.next/standalone`

Portable reproduction of https://github.com/vercel/next.js/issues/95450 (originally
reported as Windows-only with pnpm; also reported with yarn).

## Cause

`copyTracedFiles` copies a traced symlink by writing its `readlink()` target verbatim:

```ts
// packages/next/src/build/utils.ts
const symlink = await fs.readlink(tracedFilePath).catch(() => null)
if (symlink) {
  await fs.symlink(symlink, fileOutputPath)
```

On Windows, pnpm/yarn create **junctions** for `node_modules/<pkg>`, so `readlink()`
returns an absolute path (`C:\repo\node_modules\.pnpm\...`). That absolute target is
copied unchanged into `.next/standalone/node_modules`, so it keeps pointing at the
build machine's `node_modules` instead of `.next/standalone/node_modules/.pnpm`.
On Linux/macOS the same links are relative, which is why the issue does not appear there.

## Run (any platform)

```
pnpm install
pnpm repro
```

`scripts/junctionize.mjs` rewrites the top-level `node_modules` symlinks to absolute
targets (what Windows junctions look like to `fs.readlink`), then `next build` runs and
`scripts/verify.mjs` inspects `.next/standalone/node_modules`.

Expected: all standalone links resolve inside `.next/standalone`.
Actual: exit code 1, e.g.

```
BAD  node_modules/next -> /repo/node_modules/.pnpm/next@16.3.1_.../node_modules/next
```

Copying `.next/standalone` elsewhere (or into a container) then fails at runtime with
`Error: Cannot find module 'next'`.
