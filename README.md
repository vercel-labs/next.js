# Issue #97396 reproduction attempt — Turbopack `next build` deadlock with mutually-referencing async chunks

Upstream issue: https://github.com/vercel/next.js/issues/97396

The reporter's own repository (`swarupdonepudi/turbopack-chunk-name-cycle`) does not
trigger the reported hang, and neither did any of the shapes tried here. This branch
contains the harness used to search for the alleged chunk-path reference ring, so a
maintainer can extend the search, plus the acyclic/blowup evidence that was found
instead.

## What is here

- `gen2.mjs` — generates an app whose client modules form a **dense strongly-connected
  `import()` digraph** (each module dynamically imports N others, page dynamically
  imports only the entries). This is the shape that should produce
  "chunk X contains an async loader whose target group contains chunk Y" rings.
- `gen.mjs` — registry-style generator (many features, unique static leaf modules,
  shared libs, several pages with overlapping registries) to invite chunk merging.
- `analyze-chunk-graph.mjs` — builds the "chunk A embeds chunk B's file name" graph from
  `.next/static/chunks` and reports self references and non-trivial SCCs, i.e. exactly
  the cycles the issue blames.
- `watch-build.sh` — runs `next build` and samples process-tree CPU; it declares
  `HANG_DETECTED` (exit 42) if the tree sits at ~0% CPU for `STALL_SECS` while the build
  is still alive, which is the reported symptom.

## Run

```bash
node gen2.mjs app 44 3 20 2      # 44 modules, 3 dynamic out-edges each
cd app && npm install && cd ..
STALL_SECS=75 ./watch-build.sh "$PWD/app" build.log 900
node analyze-chunk-graph.mjs app
```

## Observed (Linux x64, 2 cores / 4 GB, Node 24, next 16.3.1 and 16.3.1-canary.19)

| shape | result |
| --- | --- |
| reporter's repo, `next build` | ✓ compiled in 5.2 s |
| `gen.mjs 64 24 4 12 24` (64 features, 1536 leaves, 4 pages) | ✓ 15 s, 77 chunks, 5 chunks reference other chunks, no cycle |
| `gen2.mjs app 16 3 200 2` | ✓ 10 s, 80 chunks |
| `gen2.mjs app 28 3 100 2` | ✓ 704 chunks / 12 MB from ~96 KB of source |
| `gen2.mjs app 44 3 20 2` | ✓ 50 s, **9115 chunks / 37 MB** from ~100 KB of source, 9072 chunks embed other chunk paths, **0 self references, 0 non-trivial SCCs** |
| `gen2.mjs app 48 4 400 2` | ✗ OOM-killed (`Killed`, rc 137) after ~3.5 min at 4 GB, both 16.3.1 and canary |

No hang (0% CPU park) was ever observed. Instead, mutual dynamic imports are defused by
availability info: Turbopack duplicates the async chunk content per availability path,
so the chunk-path graph stays a DAG. That duplication grows explosively with the density
of the dynamic-import graph (44 modules → 9115 chunks / 37 MB), and at 48 modules the
build exhausts a 4 GB machine.

If the deadlock needs the production chunk *merger* to fuse chunks from different chunk
groups (so that a merged chunk's content embeds the path of a chunk whose content embeds
its own), a maintainer-side hint about which merger conditions produce that fusion would
let this harness target it — `analyze-chunk-graph.mjs` already reports the cycle the
moment it exists.
