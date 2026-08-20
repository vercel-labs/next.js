# Reproduction for vercel/next.js#65306

`Module parse failed: Unexpected token` for `export enum` inside a `.ts` file in `node_modules`.

`app/page.tsx` deep-imports `duck-duck-scrape/src/util` (a raw TypeScript source file shipped
by `duck-duck-scrape@2.2.5`). webpack/Turbopack do not transpile TypeScript in `node_modules`
by default, so the build fails.

## Run

```bash
npm install
npm run build   # or: npm run dev && open http://localhost:3000
```

### Expected
Compiles.

### Actual (Next.js 14.2.3, webpack)
```
./node_modules/duck-duck-scrape/src/util.ts
Module parse failed: Unexpected token (9:7)
> export enum SafeSearchType {
```

### Actual (Next.js 16.x, Turbopack)
```
./node_modules/duck-duck-scrape/src/util.ts
Error: Unknown module type
```

## Notes
- The version pin matters: `duck-duck-scrape@2.2.6+` no longer ships `src/*.ts`, so the deep
  import then fails with `Module not found` instead.
- Also reproduces on Next.js 14.1.4 (reported as the last working version).
- Uncommenting `transpilePackages: ['duck-duck-scrape']` in `next.config.mjs` fixes compilation.
