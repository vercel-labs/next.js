# Repro: vercel/next.js#67573 — "A React Element from an older version of React was rendered" with next-mdx-remote

## Run

```bash
npm install --legacy-peer-deps
npm run dev   # visit http://localhost:3000  -> HTTP 500
# or
npm run build # fails while prerendering /
```

## Observed

Both `next dev` (Turbopack) and `next build` fail with:

```
Error: A React Element from an older version of React was rendered. This is not supported. It can happen if:
- Multiple copies of the "react" package is used.
- A library pre-bundled an old copy of "react" or "react/jsx-runtime".
- A compiler tries to "inline" JSX instead of using the runtime.
```

Verified on next@16.3.1 and next@15.5.7 (webpack and Turbopack).

## Trigger / notes

* The error only appears when the app has **react/react-dom 18.x** installed while Next 15/16 renders
  Server Components with its own React 19 runtime. `next-mdx-remote/rsc` pulls the JSX runtime through a
  CJS shim (`dist/jsx-runtime.cjs` -> `require('react/jsx-dev-runtime')`), which resolves to the app's
  React 18 copy, so the MDX elements come from a different React than the renderer.
* Swapping `react`/`react-dom` to `19.2.0` (everything else unchanged) makes the same app render fine on
  next@16.3.1, next@canary and next@15.5.7, with webpack, Turbopack, `serverExternalPackages: ['next-mdx-remote']`
  and next-mdx-remote 4.4.1/5.0.0/6.0.0.
