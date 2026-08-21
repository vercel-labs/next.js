# Repro: next/dynamic + webpack `externals` React CDN -> "Cannot read properties of undefined (reading 'getStackAddendum')"

Reproduction for https://github.com/vercel/next.js/issues/77188

## Run

```bash
npm install
npm run dev   # open http://localhost:3000/test
```

## Setup

- `next.config.js` externalizes `react` -> `React` and `react-dom` -> `ReactDOM` for the client build.
- `pages/_document.js` loads the React 18.3.1 **production** UMD builds from a CDN.
- `pages/test/index.js` renders a `next/dynamic({ ssr: false })` component and passes a `ref` to it.

## Observed (client console, `next dev`)

```
TypeError: Cannot read properties of undefined (reading 'getStackAddendum')
    at printWarning (react/cjs/react-jsx-dev-runtime.development.js)
    at Object.warnAboutAccessingRef (react/cjs/react-jsx-dev-runtime.development.js)
    at Object.createElement (react.production.min.js)
    at next/dist/shared/lib/loadable.shared-runtime.js (LoadableComponent useMemo)
```

Because only `react`/`react-dom` are externalized, `react/jsx-dev-runtime` stays bundled from
node_modules (dev build) while the runtime React is the CDN production build. The dev JSX runtime
attaches a `ref` warning getter to the props object; `next/dynamic`'s loadable runtime spreads those
props into the CDN `React.createElement`, the getter fires and dereferences
`ReactSharedInternals.ReactDebugCurrentFrame`, which does not exist in the production build.

- Reproduces with `next@13.0.0` and `next@14.2.25` (react/react-dom 18.3.1) in `next dev`.
- Does NOT reproduce with `next build && next start` (production JSX runtime is used).
- Does NOT reproduce if the CDN scripts point at the React *development* UMD builds.
