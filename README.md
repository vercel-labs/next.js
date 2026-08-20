# next#97594 — dev server reads emitted manifests while they are zero bytes

Repro of https://github.com/vercel/next.js/issues/97594 (based on the reporter's
`Faolain/nextjs-dev-manifest-empty-race`, with a deterministic driver added).

Verified with `next@16.3.0` (webpack), Linux, Node 24.17 and Node 22.15.

```bash
npm install

# 1. deterministic: reproduces all three reported failures every run
npx next dev --webpack --port 5177 > dev.log 2>&1 &
curl -s -o /dev/null http://localhost:5177/          # warm the dev server
node race.js                                          # prints REPRODUCED, exit 0

# 2. proves the bundler really creates that state on every rebuild
node measure-window.js 40
```

## What `race.js` does

`RouteModule` loads its manifests with `shouldCache: !this.isDev`, so every dev
request re-reads them from disk. `race.js` puts each manifest into exactly the
state a rebuild produces — the file exists and is **zero bytes** — while a
request is in flight, and restores it afterwards:

```
client-reference-manifest (evalManifest): GET /pricing while zero-byte -> 500, after restore -> 200
build-manifest.json (loadManifest):       GET /about   while zero-byte -> 500, after restore -> 200
next-font-manifest.json (loadManifest):   GET /docs    while zero-byte -> 500, after restore -> 200
REPRODUCED
```

`dev.log`:

```
⨯ Error: Manifest file is empty            # E328, evalManifest
 GET /pricing 500 in 1970ms
⨯ SyntaxError: Unexpected end of JSON input # loadManifest -> JSON.parse('')
 GET /about 500 in 2.5s
⨯ SyntaxError: Unexpected end of JSON input
 GET /docs 500 in 11ms
```

`handleMissing` does not help: it only catches `readFileSync` throwing for an
absent file; a present-but-empty file falls through to `JSON.parse('')` or the
E328 throw.

## What `measure-window.js` shows

Appends to a client component every 250 ms and spin-polls the emitted manifests.
Measured on this machine (40 s, dev server under concurrent load):

```
.next/dev/build-manifest.json:                          169 zero-byte windows, min 0.46ms p50 1.08ms max 35.40ms, 0.61% of wall time
.next/dev/server/next-font-manifest.json:               168 zero-byte windows, min 0.16ms p50 1.07ms max 84.91ms, 0.79% of wall time
.next/dev/server/app/page_client-reference-manifest.js: 168 zero-byte windows, min 0.16ms p50 1.00ms max 84.91ms, 0.79% of wall time
```

So the empty window is real and lasts up to tens of milliseconds per rebuild;
writing these bundler assets atomically (write + rename) would close it.

## The reporter's timing-dependent script

`bash repro.sh 120` (8 curl loops + rebuilds every 350 ms) is the original
driver. On Linux/Node 24 it did **not** land a failing read in 2×120 s runs
(instrumenting both loaders showed 0 of ~12k reads with `len=0`), because dev
requests wait on the in-flight compilation; `race.js` removes that timing
dependency while keeping the same filesystem state.
