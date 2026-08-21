# Reproduction: HMR unexpectedly triggers 404 on route update (vercel/next.js#82315)

`next dev` returns a **404 for a route that exists on disk** while the dev bundler is
repopulating `fsChecker.appFiles` after a file change.

`setup-dev-bundler.ts` does `appFiles.clear()` and then repopulates the set inside a
`for ... of` loop that contains `await`s. Every `await` yields the event loop, so any
request that arrives during the repopulation window sees an incomplete route set:
`fsChecker.getItem()` misses in `appFiles`, `ensurePage` fails with `PageNotFoundError`,
and the request is served as 404 (Next.js even compiles `/_not-found` first).

Routes added late in the (sorted) loop have the widest window, so this is much more
likely in large apps and for non-root routes — matching the report.

## Run

```bash
npm install
npm run setup   # generates app/ with 200 routes + 250 dynamic metadata files
npm run dev     # terminal 1
npm run repro   # terminal 2
```

`npm run repro` edits `app/page.tsx` repeatedly (HMR) while polling
`GET /route-199`. It exits non-zero and prints every non-200 response.

Env knobs: `ITERATIONS` (default 5), `TARGET` (default `/route-199`), `BASE`
(default `http://localhost:3000`), and for `setup`: `ROUTES`, `ICONS`.

## Observed (next@15.4.5, webpack dev)

```
 ○ Compiling /_not-found ...
 GET /route-199 404 in 1404ms
 GET /route-199 404 in 118ms
 ...
```

146 x `404` in 2 HMR iterations, while `app/route-199/page.tsx` exists the whole time.
Instrumenting `dist/.../filesystem.js` shows the cause:
`appFiles MISS for /route-199 appFiles.size= 206` (final size is 701).

Not reproduced on `next@16.3.1-canary.26` (`next dev --webpack`): the clear/repopulate
window still exists (~35-90ms measured), but canary resolves dev requests through the
route matcher, so an `appFiles` miss no longer 404s.
