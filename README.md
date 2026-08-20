# Repro: `experimental.optimizePackageImports` caches local barrel files (webpack)

Reproduction for https://github.com/vercel/next.js/issues/65630.

`next.config.mjs` lists a **local** (non-`node_modules`) barrel file package,
`experimental.optimizePackageImports: ["@/ui"]`. The webpack barrel-file
transform caches the contents of `ui/index.ts` and never invalidates it when
that file changes on disk.

```bash
npm install
npm run verify        # webpack build caching (fails on build 2, passes after rm -rf .next)
```

## A. Build caching (webpack — still broken on next@16.3.1)

1. `npx next build --webpack`
2. `mv ui/Button.tsx ui/CounterButton.tsx` and point `ui/index.ts` at `./CounterButton`
3. `npx next build --webpack` again

Result: `./ui/index.ts  Module not found: Can't resolve './Button'`.
It keeps failing on every subsequent build until `.next` is deleted.
`npm run verify` automates and asserts this.

## B. Dev caching (webpack — still broken on next@16.3.1)

1. `npm run dev` (`next dev --webpack`), load http://localhost:3000
2. Append a syntax error to `ui/index.ts`, e.g. `export const broken = (((;`
3. Reload

Result: no error is reported anywhere; the page still renders 200 with the old
barrel contents until the dev server is restarted.

## Status observed

| version / bundler | build caching | dev syntax error |
| --- | --- | --- |
| 14.2.3 webpack | fails until `.next` removed | silently ignored |
| 16.3.1 webpack (`--webpack`) | fails until `.next` removed | silently ignored |
| 16.3.1 turbopack (default) | OK | error reported |

Run the turbopack comparison with `npm run dev:turbopack` / `./verify.sh turbopack`.
