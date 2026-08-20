# Repro: middleware `matcher` config exposed to the browser (issue #47990)

Still reproduces on `next@16.3.1-canary.25` (Turbopack production build).

## Steps
```bash
npm install
npx next build
npx next start -p 3111
# in another shell
npx playwright install chromium
node check.mjs
```

`check.mjs` loads `/` and prints `window.__MIDDLEWARE_MATCHERS`, which contains the
full compiled matcher list, including `"/super-secret-admin-path/:path*"` and the
negative lookahead `"/((?!internal-only-beta-flag).*)"` declared in `middleware.ts`.

The data is served as a static asset referenced from the HTML:
`/_next/static/<buildId>/_clientMiddlewareManifest.js`
which begins with `self.__MIDDLEWARE_MATCHERS = [...]`.

Source: `packages/next/src/shared/lib/turbopack/manifest-loader.ts` (writes the manifest),
`packages/next/src/build/define-env.ts` (`process.env.__NEXT_MIDDLEWARE_MATCHERS` inlined for
webpack builds) and `packages/next/src/client/page-loader.ts` (`getMiddleware()` sets
`window.__MIDDLEWARE_MATCHERS`).
