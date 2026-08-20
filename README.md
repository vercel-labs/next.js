# Repro: `next build` hangs on long `String.prototype.concat` chains (vercel/next.js#65512)

Minimal isolation of the antd / `@rc-component/async-validator` build hang. `lib/url-concat.js`
and `lib/url-plus.js` build the **exact same** regex source (1590 chars); the only difference is
that one uses a babel-style `.concat(...)` chain and the other uses `+` concatenation.

## Run

```bash
npm install
npm run build:plus     # baseline: finishes in ~10s
npm run build:concat   # hangs during "Collecting build traces" (never finished, >11 min)
```

Direct isolation without webpack/Next build (uses the `@vercel/nft` copy bundled in Next):

```bash
node nft-bench.js
# lib/url-plus.js: 14ms
# lib/url-concat.js: never returns (event loop blocked synchronously; the 60s watchdog timer never fires)
```

## Notes

- CPU profile of the stuck `jest-worker` child shows 100% of samples inside
  `next/dist/compiled/@vercel/nft` (`MemberExpression` / `CallExpression` / `walk`), i.e. nft's
  static evaluator explodes on the nested `.concat` chain.
- Next 14.2.3 (webpack): `npm run build:concat` hangs.
- Next 16.3.1 default (Turbopack): build is fast, nft trace collection is not on that path.
  `next build --webpack` on 16.3.1 still hangs, and `node nft-bench.js` with Next 16.3.1's
  bundled nft still never returns, so the underlying analyzer bug is unfixed.
