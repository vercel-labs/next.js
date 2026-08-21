# Repro: `__dirname` is `/ROOT/...` in Turbopack (vercel/next.js#86476)

A CommonJS module (`lib/info.cjs`) is `require()`d from a server component
(`app/page.tsx`) and from `getServerSideProps` (`pages/gssp.tsx`). It reports
`__dirname` / `__filename` and whether those paths actually exist on disk.

## Run

```bash
npm install

# Turbopack (default) -> broken
npm run dev            # open http://localhost:3000 and http://localhost:3000/gssp
npm run build && npm start

# Webpack -> works
npm run dev:webpack
```

## Observed (Turbopack, next 16.0.2-canary.34, dev + build + start)

```json
{
  "dirname": "/ROOT/lib",
  "filename": "/ROOT/lib/info.cjs",
  "dirnameExists": false,
  "dataFileReadable": false,
  "dirnameReadable": false
}
```

`/ROOT/lib` does not exist, so any `fs` access relative to `__dirname`
(e.g. reading the co-located `lib/data.txt`) fails. The production bundle
contains the literal: `readdirSync("/ROOT/lib")`.

## Expected (webpack, same app)

```json
{
  "dirname": "<project>/.next/dev/server/app",
  "filename": "<project>/.next/dev/server/app/page.js",
  "dirnameExists": true,
  "dirnameReadable": true
}
```
