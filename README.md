# `"use cache"` stores a halted prerender prelude as a valid cache entry

Minimal reproduction for a **permanent cache-poisoning bug** in Next.js
`cacheComponents` + `partialPrefetching`.

- **Next.js**: `16.3.0-canary.102` (pinned exactly)
- **Mode**: production build + `next start`
- **Dependencies**: none — no database, no network, no external services

## Bug summary

When a `"use cache"` entry is filled inside a **runtime prerender**, and that
prerender's `renderSignal` aborts before the fill finishes, React's
`prerender()` produces a **halted** Flight stream: truncated, but not errored.
Next.js does not detect this case and stores the truncated stream as a healthy
cache entry (`isErrored: false`).

Every subsequent read of that entry decodes the truncated stream, hits
`close()` with chunks still pending, and fails with:

```
⨯ Error: Connection closed.
```

The entry is a normal cache **hit** from then on, so it is never re-filled: the
failure is permanent for the lifetime of the entry, and it breaks **every route
that reads the entry**, not just the one that filled it.

## Steps to reproduce

```bash
npm ci
npm run repro
```

`npm run repro` builds the app and then runs an A/B experiment on a single
route, `/slow`, restarting a cold server for each run:

| run | request to `/slow` | result |
| --- | --- | --- |
| **CONTROL** | ordinary `GET` | the shared cache entry fills correctly |
| **POISON** ×5 | `GET` with `RSC: 1` + `Next-Router-Prefetch: 2` (a runtime prefetch) | the shared cache entry is stored truncated |

After each run it reads that same entry from two **other** routes,
`/late-reader` and `/b`, and re-reads one of them three more times to show the
failure never heals.

Expected output:

```
══ CONTROL: ordinary request fills the same entry ══
   GET /slow -> http=200 in 3313ms
   /late-reader  http=200 rendered=true  digests=0
   /b            http=200 rendered=true  digests=0
   /late-reader re-read x3 rendered=[true,true,true]
   "Error: Connection closed." in server log: 0
   => HEALTHY (expected)

══ POISON round 1/5 ══
   runtime-prefetch /slow -> http=200 in 16ms
   /late-reader  http=200 rendered=false digests=1
   /b            http=200 rendered=false digests=1
   /late-reader re-read x3 rendered=[false,false,false]
   "Error: Connection closed." in server log: 5
   => POISONED
...
RESULT: poisoned in 5/5 rounds
```

Server logs for every run are written to `.repro/*.log`
(`NEXT_PRIVATE_DEBUG_CACHE=1` is enabled, so cache hits/misses/writes are
visible).

Options: `node scripts/reproduce.mjs --rounds=10 --port=4300 --skip-build`.

## Expected vs actual

**Expected** — one of:

- the interrupted fill is not stored at all (the next read re-fills it), or
- the interrupted fill is stored *and* read back with
  `unstable_allowPartialStream: true`, so the missing rows are treated as
  halted rather than as a broken connection.

**Actual** — the truncated stream is stored as a healthy entry and every later
read of it throws `Error: Connection closed.` forever. Routes that merely
*read* the entry break even though they never participated in the fill.

## What the app does

```
app/
  lib/cache.ts        getSharedSettings()  "use cache", cacheTag("shared-settings")
  lib/late-cache.ts   getLateData()        "use cache", cacheTag("late-data")
  layout.tsx          reads getSharedSettings() in the shell + generateMetadata,
                      plus a Suspense-wrapped cookies() read so every route is a
                      runtime (session-shell) prerender rather than a static page
  slow/page.tsx       reaches getLateData() only after 2500ms of *uncached* async
                      work inside a Suspense boundary   <-- fills (and corrupts)
  late-reader/page.tsx  reads getLateData() directly     <-- only ever reads
  b/page.tsx            reads getLateData() directly     <-- only ever reads
  api/invalidate/route.ts  revalidateTag(tag, { expire: 0 })
```

The only unusual thing about `/slow` is that the cached function sits behind
some uncached async work. That is what makes the timing deterministic:

1. The runtime prerender starts and waits on `cacheSignal.cacheReady()`.
2. All *currently known* cache reads settle, so `cacheReady()` resolves and the
   render signal is aborted (`prospectiveRuntimeServerPrerender`, and
   `finalRuntimeServerPrerender` runs with `cacheSignal: null`).
3. Only afterwards does `/slow` finish its uncached work and read
   `getLateData()`. That fill runs under the already-aborted signal.
4. The halted prelude is stored as a healthy entry.

The artificial `setTimeout` delays exist purely to make step 3 land after step
2 every time. In a real app the same ordering happens whenever a cached read
follows slow uncached I/O, or whenever a tag is invalidated between the
prospective and final passes of a runtime prerender — which is how we first hit
this in production (a mutation racing a link prefetch).

## Where the defect is

`node_modules/next/dist/server/use-cache/use-cache-wrapper.js`,
`generateCacheEntryImpl`, `case 'prerender-runtime': case 'prerender':`

```js
const abortSignal = dynamicAccessAbortSignal
  ? AbortSignal.any([
      dynamicAccessAbortSignal,
      outerWorkUnitStore.renderSignal,      // <-- can abort the fill
      timeoutAbortController.signal,
    ])
  : timeoutAbortController.signal;

const { prelude } = await prerender(resultPromise, ..., { signal: abortSignal });
clearTimeout(timer);

if (timeoutAbortController.signal.aborted) {
  stream = new ReadableStream({ start(c) { c.error(...) } });  // errored -> not stored
} else if (dynamicAccessAbortSignal?.aborted) {
  return { type: 'prerender-dynamic', hangingPromise };        // not stored
} else {
  stream = prelude;                                            // line 840: renderSignal
}                                                              // aborts land here
```

`outerWorkUnitStore.renderSignal.aborted` is never checked. Of the three
signals that can abort the fill, only two are special-cased; an abort caused by
`renderSignal` falls through to `stream = prelude` and is treated exactly like
a successful fill.

That matters because React's `prerender()` halts rather than errors on abort —
`finishHaltedTask` drops the pending rows silently, unlike `finishAbortedTask`,
which emits an error row. So:

- `collectResult` sees no error and calls `controller.close()`;
- `DefaultCacheHandler.set` stores the entry with `isErrored: false`;
- reads go through `createFromReadableStream` at
  `use-cache-wrapper.js:2389`, which does **not** pass
  `unstable_allowPartialStream`, so the truncated stream becomes
  `Error("Connection closed.")`.

Next's own client code reads this same kind of stream with
`allowPartialStream: true`
(`client/components/router-reducer/fetch-server-response.js:353,447`,
`client/components/segment-cache/cache.js:1369`). The server-side `"use cache"`
reader is the asymmetric one.

### Suggested fix

Treat a `renderSignal` abort like the fill timeout — error the stream so the
entry is not stored:

```js
if (timeoutAbortController.signal.aborted || outerWorkUnitStore.renderSignal.aborted) {
  stream = new ReadableStream({ start(c) { c.error(...) } });
}
```

(Alternatively, keep storing the halted prelude but read it back with
`unstable_allowPartialStream: true` — though serving a knowingly incomplete
cache entry is a larger design decision.)

## Note on `16.3.0-preview.9`

The defective code is byte-for-byte the same in `16.3.0-preview.9`, and the
halted prelude is produced there too — but with this particular trigger the
prelude is zero bytes, and preview.9's in-memory handler happens to reject it:

```
DefaultCacheHandler: set [...] failed Error: LRUCache: calculateSize returned 0,
but size must be > 0.
```

`canary.102` changed that LRU size function from `(entry) => entry.size` to
`(entry, cacheKey) => entry.size + cacheKey.length`
(`server/lib/cache-handlers/default.js:39`), so the size is never 0 and
zero-byte halted entries are now stored. The incidental protection is gone.
On preview.9 the bug still bites whenever the abort lands *mid*-fill, so the
prelude is partial rather than empty — that is the shape we hit in production.

## Impact

- Any route reading the poisoned entry fails until the entry expires
  (`cacheLife("hours")` here — an hour of hard failure).
- The entry is a cache *hit*, so no read ever re-fills it, and the failing
  render never reaches the data layer.
- With the default in-memory handler the blast radius is one server instance.
  With a **shared cache handler** (Redis, etc.) a single poisoned write would
  be served to every instance.

---

## Maintainer verification notes (next-maintainer reproduction agent)

Verified on Linux (Node 24.17.0, `next@16.3.0-canary.102`, production
`next start`): **poisoned 3/3 rounds**, control run healthy.

One fix was required to `scripts/reproduce.mjs` to make the driver work on
Linux: `stopServer()` sent `SIGTERM` to the `npx` wrapper only, so the real
`next-server` child survived and kept holding the port. Every "poison" round
then silently re-used the warm server from the control round (its log contains
only `EADDRINUSE`), which made the driver report "not poisoned". The server is
now spawned `detached: true` and the whole process group is signalled.

Evidence from a poisoned round's server log (`.repro/poison-1.log`):

```
DefaultCacheHandler: get [...,"80354b1dc207384bf719217f1e68d00931e4c864e3",[]] found {
  tags: [], timestamp: ..., expire: 4294967294, revalidate: 900
}
use-cache: leader resolved with cache handler hit [...]
⨯ Error: Connection closed.
  digest: '3079548446'
```

i.e. the truncated fill is stored and served as a healthy hit, and both
read-only routes (`/late-reader`, `/b`) fail on every subsequent read.
