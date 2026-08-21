# Turbopack file watcher does not see changes coming through a virtiofs/FUSE-style mount (next.js#90825)

Original report: Podman on macOS (virtiofs bind mount). Turbopack's watcher never
sees host-side edits; `next dev --webpack` with `WATCHPACK_POLLING=true` does.
The documented Turbopack polling option (`watchOptions.pollIntervalMs`) does not help either.

This repo reproduces the same class of failure on plain Linux (no macOS/Podman needed)
by serving the project through a `bindfs` (FUSE) mount, which — like virtiofs — does not
forward inotify events for writes made to the backing directory.

## Run (Linux, root, `apt-get install -y bindfs`)

```sh
npm install
./repro.sh            # turbopack (default) -> stale
MODE=webpack ./repro.sh   # webpack + WATCHPACK_POLLING=true -> updates
```

`repro.sh` mounts this directory at `/tmp/repro-mnt` via bindfs, starts `next dev`
inside the mount, edits `app/page.tsx` in the backing directory, and curls the page.

## Observed with next@16.3.1-canary.26

| mode | rebuild after backing-dir edit |
| --- | --- |
| `next dev` (Turbopack) | no — page still `VERSION_1` after 40s, no compile log |
| `next dev` (Turbopack) + `watchOptions.pollIntervalMs: 500` | no — plus `watch error (...): Io(Os { code: 2, kind: NotFound })` lines |
| `next dev --webpack` + `WATCHPACK_POLLING=true` | yes — `Compiling /page ...`, new content served |
