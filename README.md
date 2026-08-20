# Reproduction for vercel/next.js#41725

`next/dynamic` components never render on the first synchronous render in Jest/jsdom, and
React logs `An update to ForwardRef(LoadableComponent) inside a test was not wrapped in act(...)`.

## Run

```
npm install --legacy-peer-deps
npm test
```

## Observed (next@16.3.1-canary.25, react 19.1.0, jest 29.7.0)

- `renders the dynamically imported component synchronously` fails: only `Dynamic component:` is in the DOM.
- The act(...) warning is printed from `next/src/shared/lib/loadable.shared-runtime.tsx` (`_update` -> `forceStoreRerender`).
- The awaited test passes but the act warning remains.
