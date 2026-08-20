# Repro: vercel/next.js#95635 — Duplicate identifier 'PagesPageConfig' on `next build`

Pages Router + TypeScript app **without any `pages/api` route**.

```bash
npm install
npm run repro
```

`npm run repro` cleans `.next`, runs `next dev` once and stops it, then runs:

1. `next build` — fails on **Windows** with
   `.next/dev/types/validator.ts:7:6 Type error: Duplicate identifier 'PagesPageConfig'.`
   (exit 0 on macOS/Linux, see below)
2. `tsc --noEmit` using the `tsconfig.json` Next.js maintains — fails on **every** OS with
   `error TS2300: Duplicate identifier 'PagesPageConfig'` in both
   `.next/types/validator.ts` and `.next/dev/types/validator.ts` (so editors/tsserver show it too)
3. `NODE_ENV=development next build` — reproduces the reported Next.js error verbatim on **every** OS

## Why

`next dev` writes `.next/dev/types/validator.ts` and `next build` writes `.next/types/validator.ts`.
Both declare a top-level `type PagesPageConfig`, and `tsconfig.json` `include` contains both globs.
When the app has **no** `pages/api` route the generated file has no `import`, so it is a global
*script* rather than a module and the two declarations collide.
With an api route present the file imports `NextApiHandler`, becomes a module, and there is no clash —
which is exactly why deleting `src/pages/api` is required to hit the bug.

`next build` normally survives this because `next/dist/lib/typescript/runTypeCheck.js` drops the stale
dev types via `fileName.startsWith(path.join(baseDir, distDir, 'dev', 'types'))`. TypeScript file names
always use `/`, while `path.join` produces `\` on Windows, so the filter is a no-op there:

```bash
node win-path-filter-check.mjs
```

The same filter is skipped whenever `NODE_ENV=development` (`getDevTypesPath` returns `null`), which is
how step 3 reproduces the failure on Linux/macOS.

Workaround: delete `.next` before building.
