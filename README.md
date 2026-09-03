# Reproduction attempt for vercel/next.js#96261

`InvariantError: Expected workStore to be initialized` (E1068) on a cold `next build`.

The reporter had no public reproduction. This is a generated App Router app matching the
reported shape: 281 pages across 40 route groups, `generateMetadata` on every page and
group layout that awaits a timer and a dynamic `import()`, `cacheComponents` off,
next@16.2.11, react 19.

```bash
npm install
rm -rf .next && npm run build          # cold, Turbopack
rm -rf .next && npx next build --webpack  # cold, webpack
node gen.cjs                            # regenerate the app/ tree
```

## Result: does NOT reproduce

Cold Turbopack and cold webpack builds both succeed (exit 0, all 281 pages prerendered)
on Linux / Node 24 / 2 workers.

The mechanism proposed in the issue (an `await` losing the AsyncLocalStorage context) does
not hold: Node's async context is captured at the `await` and restored on resume, no matter
whether the awaited promise (e.g. a first-time dynamic `import()`) settles in a microtask,
a macrotask, or is resolved from an unrelated context:

```js
const als = new AsyncLocalStorage()
als.run({ route: '/x' }, async () => {
  await import('./slow-module.mjs') // top-level await + setTimeout inside
  console.log(als.getStore())       // => { route: '/x' }
})
```

A missing `workStore` at that site therefore means the store was written into a *different*
`AsyncLocalStorage` instance, i.e. `next/dist/.../work-async-storage-instance` was
instantiated twice in the build worker (duplicate `next` install, or the CJS `dist/` and
ESM `dist/esm/` copies both loaded, or - on Windows - the same file loaded under two path
casings, which produces exactly this error).
