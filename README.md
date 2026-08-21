# next#88463 - image request pending forever after a previous request was aborted

Reproduces https://github.com/vercel/next.js/issues/88463 without a browser.

```bash
npm install
npm run repro            # next dev
MODE=start npm run repro # next build + next start
```

What the script does:

1. generates 12 large (4096x4096) jpegs in `public/` (they are slow to optimize, ~5s each),
2. starts the server, requests `/_next/image?url=/img-0.jpg&w=4090&q=75` and destroys the
   client connection ~5ms later (what Chrome does when the viewport changes while the
   optimization is still running),
3. requests the exact same URL again.

Expected: step 3 returns `200`.
Observed: step 3 never responds. The URL is stuck for the lifetime of the server process,
while other image URLs keep working (`next dev` and `next start`, next@16.1.1 and 15.x).

The aborted request's internal `fetchInternalImage()` -> `handleRequest()` never settles
(the mocked response reuses the destroyed client socket), so the response-cache batcher
entry for that cache key never resolves and every later request for the same key joins
that pending entry.
