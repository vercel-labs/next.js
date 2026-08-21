# Reproduction for vercel/next.js#94740

`next/image` sorts the image config **in place**:

```js
// packages/next/src/client/image-component.tsx
const c = configEnv || configContext || imageConfigDefault
const allSizes = [...c.deviceSizes, ...c.imageSizes].sort((a, b) => a - b)
const deviceSizes = c.deviceSizes.sort((a, b) => a - b)   // mutates c
const qualities = c.qualities?.sort((a, b) => a - b)      // mutates c
```

Nothing in user space has to freeze the config: **Next.js itself does it.**

1. In production, the runtime config is read from `.next/required-server-files.json`
   via `loadManifest()` (`next/dist/server/load-manifest.external.js`), which
   applies `deepFreeze()`. `nextConfig.images` (frozen, including `deviceSizes`
   and `qualities`) becomes the value of `ImageConfigContext`
   (`base-server.ts` -> `render.tsx` / `app-render.tsx`).
2. `configEnv` (`process.env.__NEXT_IMAGE_OPTS`) is only inlined into *bundled*
   code. When `<Image>` is rendered from a package that stays external in the
   server build (e.g. `@sitecore-jss/sitecore-jss-nextjs`, any plain CJS
   component library in `node_modules`), `next/dist/client/image-component.js`
   runs unbundled, `configEnv` is `undefined`, and the **frozen** `configContext`
   is used.

Result (prod only, dev is fine):
`TypeError: Cannot assign to read only property '0' of object '[object Array]'`
at `next/dist/client/image-component.js:246` inside `useMemo` — the exact frame
reported in the issue.

## Run

```bash
npm install          # postinstall copies vendor/external-image-pkg into node_modules
npm run build
npm start
curl -s localhost:3000/external-pkg-error    # prints the TypeError + stack
```

`/external-pkg-error` renders the external-package `<Image>` with the frozen
manifest config through `ReactDOMServer` so the error is visible in the response.

On Vercel the plain page crashes as a 500 with no extra glue:

- `/external-pkg` -> **500** (unbundled `next/image` + frozen config from the manifest)
- `/bundled` -> 200 (`__NEXT_IMAGE_OPTS` is inlined for the page's own import)
- `/diag` -> shows `configEnvType: "undefined"`, `ctxQualitiesFrozen: true`,
  `sortError: "Cannot assign to read only property '0' ..."`

## Fix

```js
const deviceSizes = [...c.deviceSizes].sort((a, b) => a - b)
const qualities = c.qualities ? [...c.qualities].sort((a, b) => a - b) : undefined
```
