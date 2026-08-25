# Turbopack dev livelock repro (darwin-arm64)

Reproduction for [vercel/next.js#97847](https://github.com/vercel/next.js/issues/97847) — Turbopack dev server livelocks on macOS Apple Silicon in pnpm workspace monorepos, spinning all tokio workers on the turbo-tasks scheduler queue lock.

## Stack

- **OS:** macOS Darwin 25.5 ARM64 (Apple Silicon)
- **Node:** v24.14.0, **pnpm:** 11.20.0
- **next:** 16.2.11 (Turbopack, default dev engine)
- **Layout:** pnpm workspace monorepo (5 packages) + Turborepo task runner

## Reproduce

```bash
pnpm install
pnpm exec turbo run dev          # → next dev --turbo -p 3137
```

### Expected (on a non-affected version, e.g. `next@16.4.0-canary.6`)

`✓ Ready` in ~250ms, idle at 0% CPU, `curl http://localhost:3137/` → 200 in ~2s.

### Actual (on `next@16.2.11` and all stable through 16.3.2)

`✓ Ready` prints, then `next-server` climbs to **603–777% CPU** within ~30s, RSS grows to 3.5GB, and **no request ever resolves** (`curl /` hangs to any client timeout). No `Compiling /` line, no error.

### `sample` profile of the stuck `next-server`

```
6300 Thread_*: tokio-runtime-worker            ← 11 threads, all 100% busy
+ 6299 ???  (in next-swc.darwin-arm64.node)
  + 2909 _pthread_cond_wait                    ← scheduler queue-lock contention
  + 1600 active SWC frames (no forward progress)

notify-rs fsevents loop  ← idle (mach_msg2_trap)
libuv-worker (×4)        ← idle (uv_cond_wait)
```

The file watcher and libuv pool are idle — this is a turbo-tasks scheduler spin, not a watcher problem.

## Bisect

| version | idle CPU | `GET /` | after request |
|---|---|---|---|
| `16.2.11` (stable) | 603% → 777%, RSS → 3.5GB | hangs → HTTP 000 | still 777% |
| `16.4.0-canary.6` (post #96808) | **0%**, 356MB | **200 in 1.97s** | **0%** |

The fix is [PR #96808](https://github.com/vercel/next.js/pull/96808) *"turbo-tasks: execute scheduled tasks inline when they are read"* (merged 2026-08-24), which addresses the "most contended lock in the system" — the turbo-tasks scheduler queue lock. It is **canary-only** as of 2026-08-25; no stable release contains it.

## Workarounds

- `next dev --webpack` (bypasses Turbopack)
- pin `next@16.4.0-canary.6`
---

## Maintainer verification notes (vercel/next.js#97850)

This copy of `koding88/repro-turbo-livelock` (upstream commit `00f5e0022ac95b932df624e4158df4891fabb93c`)
was repaired so it can actually build. Three defects blocked it on any platform:

1. `pnpm install` failed with `ERR_PNPM_IGNORED_BUILDS: sharp@0.34.5` (pnpm 11). Fixed by adding
   `allowBuilds: { sharp: true }` to `pnpm-workspace.yaml`.
2. `packages/ui/package.json` exported `./src/index.ts`, but the file is `index.tsx`
   → `Module not found: Can't resolve '@repo/ui'`, `GET / 500`.
3. `packages/ui/src/index.tsx` `Table` had an unbalanced `)` → JSX parse error, `GET / 500`.

Result on linux x64 (2 cores), `next@16.2.11`, `next dev --turbo`, cold `.next`:
`✓ Ready in 311ms`, idle `next-server` at ~0–3% CPU / ~540 MB RSS for 6 min,
`GET /` → **HTTP 200 in 298 ms**. No livelock, no runaway CPU.

The reported livelock is claimed to be darwin-arm64-specific (the issue itself states Linux is
immune), so this reproduction cannot confirm it on Linux hardware.
