# `next dev` retains ~90 MB per edit: `fakeFunctionCache` and `generatedSourceMapCache` grow without bound

Minimal reproduction for a memory leak in the Next.js dev server. A single Server Component page
with many JSX elements is enough. No MDX, no extra config, no dependencies beyond the template.

## Run it

```bash
pnpm install
NODE_OPTIONS="--max-old-space-size=3072" pnpm dev
```

Open `http://localhost:3000/` once. Then insert a line near the top of `app/page.tsx`, save, wait a
second, and reload the page. Repeat, watching RSS of the `next-server` process. It climbs by roughly
90 MB each time and never comes back down.

Insert the line at the **top**, not the bottom. That shifts the line and column of every element
below it, which is what makes each of React's `fakeFunctionCache` keys new on every edit. Appending
at the end of the file grows memory far more slowly.

## Or use measure.sh

`measure.sh` automates that loop and prints the RSS after each edit:

```bash
./measure.sh                        # the leaking case
./measure.sh --disable-source-maps  # the control
```

```
next-server pid 175197, 3072 MB heap cap, 6 edits
after first render         400 MB
after  1 edit(s)           499 MB
after  2 edit(s)           594 MB
...
grew 574 MB over 6 edits (~95 MB per edit)
```

Any extra arguments are passed through to `next dev`. Three environment variables tune it:

| var | default | meaning |
|---|---|---|
| `PORT` | 3333 | refuses to start if the port is already in use |
| `EDITS` | 12 | how many edits to make |
| `HEAP_MB` | 3072 | `--max-old-space-size`, so a runaway fails fast instead of swapping |

It restores `app/page.tsx` on exit, including on Ctrl-C, and it kills only the process group it
started — an unrelated `next dev` elsewhere on your machine is left running.

Compare the per-edit figure between the two runs; that slope is the bug. The absolute numbers depend
on whether `.next` is warm, and a short run inflates the per-edit average because start-up cost is
amortised over fewer edits. Use `EDITS=12` or more when quoting a figure.

## Measured (next 16.4.0-canary.15, node 26.6.0, linux x64)

RSS of the `next-server` process, one line inserted near the top of `app/page.tsx` per edit:

| run | after first render | after 12 edits | per edit |
|---|---|---|---|
| `next dev` | 599 MB | 1666 MB | **+89 MB** |
| `next dev --disable-source-maps` | 508 MB | 570 MB | +5 MB |

Identical on `16.4.0-canary.14`, so this is not a fresh regression in the newest canary.

Growth is linear and never falls. With a larger page it is far worse: on a ~790-line MDX post the
dev server went from 1170 MB to 4872 MB in 17 seconds over 2 edits and then died.

## Heap snapshot

Taken after 10 edits (`--heapsnapshot-signal=SIGUSR2`), total self size 1010 MB:

| bytes | count | node |
|---|---|---|
| 208 MB | 6030 | this page's own source text (`// MARKER\n…function Section…`) |
| 106 MB | 6030 | that module's source-map `mappings` |
| 71 MB | 950 | `/* This module was rendered by a Server Component… */` (eval'd fake-function sources) |

Two strong Maps hold it, and their hash tables are exactly the same size, so they grow in lockstep
— one entry in each per cache miss:

```
Map @1124027  table entries=13273  <- context:fakeFunctionCache          (React flight client)
Map @1342567  table entries=13273  <- context:generatedSourceMapCache    (node:internal/source_map/source_map_cache)
```

## Mechanism

1. `next dev` starts the server with `--enable-source-maps` (`next/dist/cli/next-dev.js:287`).
2. Turbopack evaluates each server module version with `eval`, under a sourceURL carrying `?id=…`.
3. React's flight client rebuilds owner stacks. `buildFakeCallStack` keys `fakeFunctionCache` by
   `name-file-LINE-COL-encLine-encCol-flag-env`
   (`compiled/react-server-dom-turbopack/cjs/react-server-dom-turbopack-client.node.development.js:3618`).
4. On a miss it calls `findSourceMapURLDEV`. `getSourceMapURLFromTurbopack` returns `null` for any
   URL containing `?` (`server/dev/hot-reloader-turbopack.js:255`) — exactly these eval'd HMR
   modules — so Next falls back to `module.findSourceMap`, `JSON.stringify`s the whole payload
   including `sourcesContent`, and base64-encodes it into a `data:` URL
   (`server/lib/source-maps.js:167-186`).
5. `createFakeFunction` (:3520) concatenates padding + that data URL +
   `//# sourceURL=about://React/<env>/<file>?<fakeFunctionIdx++>` and calls global `eval`.
6. Each miss leaves two permanent entries. React keeps the eval'd script source. Node parses the
   inline data URL and keeps the decoded map under a key that is unique by construction, so it can
   never be hit again.

Inserting a line shifts the line and column of every element, so every `frameKey` is new on every
edit.

## Why deno and bun do not hit this

Probe: eval a source carrying `//# sourceURL` and an inline `//# sourceMappingURL`, then call
`module.findSourceMap` on that URL.

| runtime | `console.createTask` | `findSourceMap(eval'd)` |
|---|---|---|
| node `--enable-source-maps` | function | FOUND |
| node (no flag) | function | undefined |
| deno | function | undefined |
| bun | **undefined** | undefined |

bun has no `console.createTask`, so React's `supportsCreateTask` is false and `createFakeFunction`
never runs. deno has it but does not cache generated source maps, so `sourceMap` is `null` and each
eval'd source stays tiny. The leak needs both node behaviours together.

## `--disable-source-maps` is a mitigation, not a fix

It removes node's half. React's cache still grows, at ~40 KB per frame instead of ~1 MB, because
`createFakeFunction` pads its source with `"\n".repeat(enclosingLine - 1)` and V8 allocates a
line-ends table per script. A snapshot of a flagged run showed 53,040 fake-function scripts and
956 MB of `(script line ends)`.

## Suggested fixes

- Bound `fakeFunctionCache`, or clear it per HMR generation.
- Do not inline a whole chunk's source map per stack frame. If `getSourceMapURLFromTurbopack`
  stripped the `?id=` query instead of bailing on `?`, the `data:` URL would never be built.
- Node's `generatedSourceMapCache` being an unbounded strong Map is tracked upstream at
  https://github.com/nodejs/node/issues/65760.

---

## Maintainer verification notes (issue vercel/next.js#98221)

Verified in the sandbox on Node v24.17.0, linux x64, next 16.4.0-canary.15:

```
./measure.sh                        454 MB -> 1616 MB over 12 edits (~96 MB/edit)
./measure.sh --disable-source-maps  405 MB ->  595 MB over 12 edits (~15 MB/edit)
```

Two changes were needed to run it here (pnpm 11 environment only):
- `.npmrc` / `pnpm install --config.minimumReleaseAge=0` because the lockfile pins a
  canary newer than pnpm's default minimum release age.
- `measure.sh` starts the dev server via `node node_modules/next/dist/bin/next dev`
  instead of `pnpm exec next dev`, to skip pnpm's pre-run dependency verification.

Run:
```
pnpm install --config.minimumReleaseAge=0
PORT=3333 EDITS=12 ./measure.sh
```
