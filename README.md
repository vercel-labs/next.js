# Repro: next 15.0.x fails on Node.js 19.0.x-19.7.x (issue #71996)

Docs claimed "Node.js 18.18 or later", and `next@15.0.1` declared `engines.node: ">=18.18.0"`,
but rendering fails on Node 19.0.0-19.7.x.

## Steps

```bash
nvm install 19.5.0 && nvm use 19.5.0
npm install
npm run dev
curl -i http://localhost:3000/
```

## Result (Node 19.5.0, next 15.0.1)

HTTP 500 and in the dev server output:

```
⨯ TypeError: maybeGlobalAsyncLocalStorage.snapshot is not a function
  at createSnapshot (node_modules/next/dist/server/app-render/async-local-storage.js:64:45)
```

## Root cause

`AsyncLocalStorage.snapshot()` landed in Node 18.16.0 and 19.8.0, so it exists on 18.18.x
(the documented minimum) but not on 19.0.0-19.7.x.

## Current state

`next@>=15.1` sets `engines.node: "^18.18.0 || ^19.8.0 || >= 20.0.0"` and `next dev` exits with
`You are using Node.js 19.5.0. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required.`
Docs now state a 20.9 minimum, so only the historical 15.0.x range is affected.
