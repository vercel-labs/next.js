# Repro mirror for vercel/next.js#80582

`Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache
without a Suspense boundary nor a "use cache" above it` with `experimental.dynamicIO` on an app that
contains no async component.

The reporter's repro is a StackBlitz project (https://stackblitz.com/edit/nextjs-84hachdn), whose files
are not downloadable outside the browser. This branch mirrors those files byte-for-byte
(StackBlitz `nextjs` starter = old create-next-app app-router + Tailwind template, `next` bumped to
`15.4.0-canary.83`, `experimental.dynamicIO: true` added). `app/layout.tsx` / `app/page.tsx` are
fully synchronous.

## Run

```bash
npm install --legacy-peer-deps
npm run dev
# then request http://localhost:3000/ and watch the terminal
```

## What was observed

* In the reporter's StackBlitz (WebContainer, webpack dev, `@next/swc-wasm-nodejs` fallback) the error
  is still logged today on the very first request to `/`:

  ```
  Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache
  without a Suspense boundary nor a "use cache" above it. ...
      at app_render_App (.../app-page-experimental.runtime.dev.js)
  ```

* The same files on Linux/x64 (Node 20.19.1 and Node 24) with `next@15.4.0-canary.83` do **not** log
  the error: `GET / 200`, and `next build` succeeds. Clean `create-next-app` projects with
  `dynamicIO`/`cacheComponents` on `15.4.2-canary.46` (webpack and Turbopack) and on
  `16.3.1-canary.26` also do not log it.

So the failure appears to be environment specific (reproduces in StackBlitz WebContainer, not on a
native Linux install of the identical project).
