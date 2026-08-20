# Repro: `ReferenceError: TextEncoder is not defined` (vercel/next.js#49397)

Jest with the `jsdom` test environment (`jest-environment-jsdom@29`, which does not
provide the `TextEncoder` global) crashes as soon as a module imports `next/cache`
(or `next/server`), because Next.js internals evaluate `new TextEncoder()` at module scope.

## Run

```bash
npm install
npm test
```

## Observed (next@16.3.1-canary.25)

- `src/actions.test.js` (jsdom): `ReferenceError: TextEncoder is not defined`
  at `next/dist/shared/lib/router/utils/cache-busting-search-param.js:25` via
  `next/cache` -> `unstable-cache` -> `patch-fetch` -> `response-cache` -> `render-result`
  -> `node-web-streams-helper`.
- `src/next-server-import.test.js` (jsdom): `ReferenceError: Request is not defined` from `next/server`.
- `src/actions.node.test.js` (`@jest-environment node`): passes.

Workaround: use `@jest-environment node` for server code, or polyfill
`TextEncoder`/`TextDecoder`/`Request` in a custom jsdom environment.
