# Repro: vercel/next.js#83799

Turbopack emits code that ignores the project's browserslist targets.

`package.json` targets `chrome 64, edge 79, firefox 67, opera 51, safari 12`
(`globalThis` needs Chrome 71+, optional chaining / nullish coalescing need Chrome 80+).

## Run

```bash
npm install
npm run build     # next build --turbopack
npm run check     # inspect .next/static/chunks
```

## Result (next 16.3.1)

Every client chunk starts with the Turbopack chunk-registration prologue

```js
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([...])
```

and the runtime chunk contains `i.g = globalThis`. These are unguarded, so
evaluating any chunk in an environment without `globalThis` (Chrome < 71) throws
`ReferenceError: globalThis is not defined` — `npm run check` reproduces this by
running each chunk in a `vm` context whose `globalThis` binding was deleted.

With next 15.5.3 the `turbopack-*.js` runtime chunk additionally fails to parse as
ES2019 (it contains optional chaining / nullish coalescing). That part was fixed in
16.x, but the `globalThis` references remain.

For comparison, `npm run build:webpack` produces globalThis references in 4/8
chunks (from Next.js runtime code) instead of in every chunk.
