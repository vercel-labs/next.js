# next dev memory probe — vercel/next.js#82511

The reporter's repository (`NeoSahadeo/Avg-NextJS-experience`) now returns 404, so this is a
minimal harness built from the leads in the issue thread (Turbopack `next dev`, App Router,
nested dynamic route `/[locale]/events/[eventId]/payments/[cartId]`, 2 GB old-space limit).

## Run

```bash
pnpm install
NODE_OPTIONS="--max-old-space-size=2048" pnpm dev
# in another shell
./memory-probe.sh 3000 6000
```

`memory-probe.sh` requests N unique dynamic-route paths and prints the dev server RSS after each
request, so heap growth over time is visible.

## Result on next@16.3.1 (Node 24.17.0, Linux x64, 2 cores / 4 GB)

* `next-server` RSS grows from ~0.4 GB to ~1.47 GB over ~6.3k unique dynamic-route requests.
* Growth decelerates (+295 MB over requests 800–1200, +11 MB over 2400–2800) and no
  `FATAL ERROR: Reached heap limit` occurs; all responses stay 200 in ~30 ms.
* `next@15.4.6` (the version the original reporter said crashed instantly) starts and serves the
  same route fine here — that part of the report looks environment specific.

So this harness measures growth but does **not** OOM. To turn the still-open Next 16 reports into a
reproduction, a project that renders the failing page (userland/library code) is needed.
