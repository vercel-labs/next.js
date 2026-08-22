# Repro: Server Action / `router.refresh()` re-render withheld for seconds (#97742)

Next.js applies Server Action results and `router.refresh()` through
`startTransition`. While **any unrelated async transition is still pending**,
React withholds that router update for the whole lifetime of the pending
transition, even though the RSC payload has already arrived and the main thread
is idle. This matches the report in vercel/next.js#97742 (seconds-long stall,
payload already received, no refetch needed).

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3000
# automated:
npx playwright install chromium
node repro.mjs           # add FORCE_CLICK=1 to also fire an unrelated click after 400ms
```

Manual: click **1. open unrelated async transition**, then within 8s click
**2. run server action + router.refresh()**. The heading keeps showing the old
value; the log shows the action resolved immediately, but `RENDER`/`COMMIT` of
the new value only happen when the unrelated transition settles ~8s later.
Clicking **3. unrelated click** does not flush it.

## Observed (next 16.2.12 and 16.4.0-canary.1, react 19.2.4, production build)

```
1122ms 1) opened an unrelated async transition (settles in 8s)
1452ms 2) server action dispatched
1467ms server action resolved -> 129200 (RSC payload received)
1467ms router.refresh() called
9123ms unrelated async transition body finished
9127ms RENDER with new server value (was=129100 now=129200)
9130ms COMMIT value=129200
```

Without step 1 the same action commits in ~60ms.
