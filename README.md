# next.js#40178 — `typeof Buffer` pulls the 22.5 kB Buffer polyfill into client chunks

Reproduction of https://github.com/vercel/next.js/issues/40178 on Next.js canary
(verified with `16.3.1-canary.25`, both Turbopack and webpack builds).

`pages/index.js` only contains a feature detection:

```js
const isNode = typeof Buffer !== 'undefined'
```

Next.js' `ProvidePlugin` (and the Turbopack equivalent) rewrites the bare
`Buffer` identifier to an import of the `buffer` npm polyfill, so:

* the page's client chunk grows by ~22.5 kB (webpack: 342 B -> 22,893 B;
  Turbopack: 13,836 B -> 36,434 B), and
* the check evaluates to `true` in the browser even though `window.Buffer`
  is still `undefined`.

## Run

```bash
npm install
./scripts/measure.sh webpack   # or: ./scripts/measure.sh   (Turbopack)
```

Expected: both builds produce the same tiny chunk.
Actual: the build containing `typeof Buffer` ships the `buffer` polyfill
(detectable via `INSPECT_MAX_BYTES`, `base64-js`, `ieee754`).
