# Repro: next/og `ImageResponse` — `TypeError: The "payload" argument must be of type object. Received null`

Issue: https://github.com/vercel/next.js/issues/76407

## Run

```bash
npm install
npx next dev
# then request the route
curl -i http://localhost:3000/opengraph-image
```

## Findings

* `app/opengraph-image.tsx` (the reporter's code) actually throws a satori error:
  `Expected <div> to have explicit "display: flex" ...` because `{"aaa"} 🎉` are two children.
* While Next.js source-maps that error, Node.js `findSourceMap()` chokes on the sourcemap of
  `node_modules/next/dist/compiled/@vercel/og/index.node.js`:
  * next@15.1.7 + Node 20.17.0 -> the whole request fails with
    `ERR_INTERNAL_ASSERTION: The "payload" argument must be of type object. Received null`,
    masking the real error.
  * next@canary (16.3.1-canary.26) + Node 20.17.0 -> only a warning
    `Invalid source map. Only conformant source maps can be used ... Received null`,
    the real satori error is shown.
  * next@canary + Node 24.17.0 -> no source map error at all (Node fix, >= 22.14).
* `app/fixed/opengraph-image.tsx` is the same markup with `display: flex` and returns 200 image/png.

To reproduce the original crash: `npm i next@15.1.7` and run with Node 20.17.0.
