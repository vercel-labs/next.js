# Repro: `!` in `assetPrefix` breaks webpack build (next.js#71426)

`assetPrefix` is interpolated unescaped into the `next-app-loader` request in
`next/dist/build/entries.js`, and webpack treats `!` as a loader separator, so the
request is split and the tail is resolved as a module.

## Steps

```bash
npm install --legacy-peer-deps
npm run build          # next build --webpack -> fails
npm run build:turbopack # next build (turbopack) -> succeeds
```

## Expected
Build succeeds; `!` in `assetPrefix` is escaped in the internal loader request.

## Actual (webpack, Next.js 16.3.1 and 15.0.0-canary.196)

```
Failed to compile.

Module not found: Error: Can't resolve 'mark&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=' in '<project>'
```

Notes:
- App Router only; `output: "export"` is not required (fails with plain `assetPrefix` too).
- Turbopack builds (default in Next 16) are unaffected.
