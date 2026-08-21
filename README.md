# Repro: next/image — aborting a cold transform permanently hangs that cache key

Mirror + hardened verification for https://github.com/vercel/next.js/issues/97489
(original reporter repo: https://github.com/Neeptossss/next-image-abort-hang @ c487d2fe520047bb6f323d4cd52aea91accafb08)

## Run

```bash
npm install
node scripts/make-image.mjs   # generates public/big.jpg (26.8 MB, 6000x4000)
npx next build
./verify.sh                   # deterministic single-server sweep (recommended)
# or ./repro.sh               # reporter's original 4-phase script
```

`verify.sh` additions over `repro.sh`:

* prints a **baseline** cold transform with no abort, so "hung" cannot be confused with "slow"
  (baseline ~0.3 s vs. 45 s / 120 s no-response for an aborted key);
* uses generous (45 s / 120 s) verification timeouts instead of 6 s;
* uses a dedicated port and a single server instance, avoiding the `EADDRINUSE`
  race in `repro.sh`'s `stop_server`/`start_server` pair which can make phases 3
  and 4 report bogus results (the "restarted" server is really the old process).

## Observed on next@16.3.1, Node 24.17.0, Linux x64

```
--- baseline: cold transform, NO abort (w=1200 q=60) -> 200 in 0.397s
abort@0.017  w=32    q=50  -> 000:45.001980   (curl timed out, no response)
abort@0.005  w=1080  q=50  -> 000:45.002502
...
HUNG: 32:50 48:50 1080:50 1200:50 1920:50 640:75 750:75 828:75 1080:75 128:90 384:90   (11 / 42)
recheck w=32 q=50 with -m 120 -> 000:120.002373   (still no response)
other keys on the same server (w=1920&q=80, w=32&q=70, w=2048&q=60) -> 200 in <1s
`/` -> 200. Nothing whatsoever is logged by the server.
after process restart, the same keys -> 200 in ~0.3s   (process state, not disk state)
with `socket: _req.socket` removed from fetchInternalImage() -> 0 / 42 hung
```

Hangs only occur when the abort lands in the first ~30 ms (while the source file
is still streaming into the coalesced internal request).
