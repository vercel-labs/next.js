# next#74916 — `next build` middleware size excludes WASM/assets that Vercel counts

Repro of https://github.com/vercel/next.js/issues/74916

`middleware.js` imports a 1.25 MB `.wasm` asset (same shape as Prisma/Arcjet edge bundles).

```bash
npm install
npm run build        # prints "ƒ Middleware  62.2 kB"
node measure-size.js # real Edge bundle: 1.31 MB gzip (Vercel enforces this)
```

Next.js 15.1.4 `printTreeView` only gzip-sums `middlewareManifest.middleware['/'].files`
(`server/middleware.js` + `server/edge-runtime-webpack.js`) and ignores the `wasm` and
`assets` entries of the same manifest, so the build log claims the middleware is far below
1 MB while Vercel rejects the deployment with
`The Edge Function "middleware" size is 1.0x MB and your plan size limit is 1 MB`.
