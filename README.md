# Repro: message-less `StaticGenBailoutError` reaches `onRequestError` (cacheComponents)

Issue: https://github.com/vercel/next.js/issues/95867 — Next.js 16.2.9, `cacheComponents: true`.

A fully static route awaits a `"use cache"` section fetcher. When the fetcher throws at
runtime, the catch path performs sync IO (`Math.random()`, the same class of violation as
`Sentry.captureException` → `crypto.randomUUID()`). The patched global records the violation
without throwing, so the runtime prerender aborts in
`throwIfSyncIOUsed` (`packages/next/src/server/app-render/dynamic-rendering.ts`), which prints
the real reason to `console.error` and then throws `new StaticGenBailoutError()` — no message,
no cause.

## Run

```bash
npm install
npm run build                       # succeeds: backend "works" at build time
FAIL_BACKEND=1 npx next start -p 3001
curl -i http://localhost:3001/p/b   # on-demand runtime prerender -> 500
```

`instrumentation.ts` logs what `onRequestError` receives:

```
[onRequestError] name=Error message="" cause=undefined keys=["code"]
[onRequestError] stack:
Error:
    at H (.../next-server/app-page-turbo.runtime.prod.js:5:195)
    ...
    at async nh.handleRevalidate (.../app-page-turbo.runtime.prod.js:17:9464)
```

while the only record of the reason is stdout:

```
Error: Route "/p/[id]" used `Math.random()` before accessing either uncached data ...
       https://nextjs.org/docs/messages/next-prerender-random
Error:
    at ignore-listed frames { code: 'NEXT_STATIC_GEN_BAILOUT' }
```

## Background ISR revalidation variant

```bash
FAIL_BACKEND=1 npx next start -p 3000
curl -s localhost:3000/revalidate    # revalidatePath('/')
curl -s -o /dev/null localhost:3000/ # stale served, background revalidate throws
```

Server log shows the same reason on `console.error` followed by the empty `Error` with
`code: 'NEXT_STATIC_GEN_BAILOUT'`.

## Expected

The thrown `StaticGenBailoutError` should carry `serverDynamic.syncDynamicErrorWithStack.message`
(or the original error as `cause`) so error trackers get an actionable event.
