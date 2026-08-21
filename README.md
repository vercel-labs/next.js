# issue #96470 — probes for "route on disk 404s in `next dev`" (Turbopack)

Investigation harness for https://github.com/vercel/next.js/issues/96470.

Environment used: Linux x86_64, Node 24, `next@16.3.0-canary.105` (same canary the
reporter pinned). The reporter's own repo
(https://github.com/Crsk/turbopack-dev-cache-timing) states it is not a
reproduction of the 404; it only measures dev-cache write timing.

## Confirmed (reporter's own harness, unmodified)

`node scale.mjs 60 && node characterize.mjs` reproduces the deferred flush exactly:

```
  after boot                             8 KB
  after compiling 60 routes              8 KB
  t+2.0s idle  (moving)                 85 MB
  t+2.5s idle  (settled)                85 MB
  after graceful SIGTERM                85 MB
```

So the persistent Turbopack dev cache is written as one batch ~2s after the last
request, not during compilation and not at shutdown.

## Not reproduced: the 404 itself

Minimal app: `app/api/a/[id]/route.ts` (parent) + `app/api/a/[id]/detail/route.ts`
(nested), matching the reported shape (nested 404s, parent 200s).

| probe | script | result |
| --- | --- | --- |
| route file restored while server is down, with a backdated (2021) mtime, then dev restarted | `node probe.mjs` | nested route **200**, present in `app-paths-manifest.json` |
| nested route created while dev is running, after a 404 was already cached — plain create, backdated create, atomic `rename()` of a backdated dir | `node live.mjs` | **200** in all three variants |
| same creation after forcing inotify queue overflow (`fs.inotify.max_queued_events=64` + 20k file events in the watched tree) | `node overflow.mjs` | **200**, route in manifest |
| content edited in place with identical size and the original (older) mtime restored | `node stale-content.mjs` | new content served, no staleness |

Nothing here produced a `404 text/html` for a route present on disk, so on Linux
(inotify) the watcher never lost the route. The report is macOS arm64 (FSEvents
recursive watcher) under churn from ~6 parallel git worktrees, on an app with 377
route handlers and ~2 GB of dev cache, and the reporter cannot trigger it on
demand either.

## Next step for whoever has a macOS repro

`TURBO_TASKS_FORCE_WATCH_MODE=non-recursive` (see
`turbopack/crates/turbo-tasks-fs/src/watcher/mod.rs`) swaps the recursive FSEvents
watcher for the per-directory one. If the 404 disappears under that flag, the loss
is in the recursive macOS watcher path rather than in the persistent cache.

```bash
npm install
node probe.mjs
node live.mjs
node stale-content.mjs
sudo sysctl -w fs.inotify.max_queued_events=64 && node overflow.mjs   # Linux only
```
