# Repro: next.js#84342 — `output: standalone` broken when pnpm virtual store is outside `node_modules`

## Steps

```bash
pnpm i --virtual-store-dir ~/.cache/vstore/app/
./node_modules/.bin/next build --webpack
node .next/standalone/server.js
```

## Observed

- `.next/standalone/node_modules/` contains only a copied `next` symlink pointing at
  `../../../root/.cache/vstore/app/next@.../node_modules/next` (resolves outside the standalone dir);
  `react` / `react-dom` are missing entirely.
- Traced `next` files are written to `<project>/root/.cache/vstore/app/...` instead of inside `.next/standalone`.
- `node .next/standalone/server.js` throws `Error: Cannot find module './cpu-profile'`.

## Expected

`.next/standalone/node_modules` contains the complete, self-contained dependency tree.
