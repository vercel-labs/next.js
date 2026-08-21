# Verification repro for vercel/next.js#91312

Claim: `create-app-route-code.ts` uses `pagePath.replace(/[\\/]/, '/')` (no `g` flag), so on
Windows a nested app route (`app/api/nested/route.ts`) produces `app/api\nested\route` and
`resolveAppRoute` fails during `next build`.

## Run

```
npm install
npm run sim      # Windows code path simulated via path.win32 (runs on any OS)
npm run build    # next build --webpack (webpack app loader; Next 16 defaults to Turbopack)
```

## Result

`npm run sim` prints:

```
pagePath passed to the loader on Windows: "private-next-app-dir/api/nested/route.ts"
routePath (current canary regex, no /g): "private-next-app-dir/api/nested/route.ts"
resolveAppRoute(routePath): "C:\\proj\\app\\api\\nested\\route.ts"

hypothetical backslash pagePath: "private-next-app-dir\\api\\nested\\route.ts"
  routePath (no /g): "private-next-app-dir/api\\nested\\route.ts"
  resolveAppRoute  : "C:\\proj\\app\\api\\nested\\route.ts"
  with normalizePathSep fix: "C:\\proj\\app\\api\\nested\\route.ts"
```

Two reasons the reported failure cannot occur:

1. `pagePath` reaching the loader is already POSIX. `createPagesMapping`
   (`build/route-discovery.ts`) returns `normalizePathSep(join(APP_DIR_ALIAS, pagePath))`, and the
   dev path in `hot-reloader-webpack.ts` uses `posix.join(APP_DIR_ALIAS, relative(...).replace(/\\/g, '/'))`.
   A build probe on the webpack loader confirmed `pagePath = "private-next-app-dir/api/nested/route.ts"`.
2. Even with backslashes, `resolveAppRoute` is `createAbsolutePath`, which does
   `.replace(/\//g, path.sep)` — on Windows `path.sep === '\\'`, so mixed separators collapse to the
   same absolute path. It also always returns a string, so the `Invariant: could not resolve page path`
   throw is unreachable from this input.

`next build` (default) does not even execute this loader in Next 16 — Turbopack is the default;
`--webpack` is required to reach `create-app-route-code.ts`.
