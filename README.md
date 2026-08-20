# Repro: Turbopack dev never picks up file changes on mounts that do not deliver inotify events (vercel/next.js#71622)

Issue: https://github.com/vercel/next.js/issues/71622 — "Hot reload doesn't work inside Docker container".

Docker Desktop bind mounts (Windows/macOS, gRPC-FUSE / virtiofs / 9p) make host edits
visible inside the container but do **not** deliver inotify events for them. This repro
emulates exactly that property on plain Linux with an overlayfs mount (edits to the
`lowerdir` are visible through the mount, but generate no inotify events), so no Docker
Desktop VM is needed.

Verified with Next.js 16.3.1, Node 24.17.0, Linux 6.18.

## Result

| dev server | HMR after a host edit (no inotify event) |
| --- | --- |
| `next dev` (Turbopack, default) | **stale forever** – no recompile, a fresh request/hard reload still returns the old HTML |
| `WATCHPACK_POLLING=true next dev` (Turbopack) | **stale forever** – Turbopack ignores the polling env var |
| `next dev --webpack` | stale (webpack also relies on inotify by default) |
| `WATCHPACK_POLLING=true next dev --webpack` | **works** – change is picked up (the workaround reported in the issue) |
| `next dev` (Turbopack), edit made *through* the mount so inotify fires | works (control – setup is otherwise healthy) |

So on event-less mounts (Docker Desktop / VS Code Dev Containers on Windows & macOS) the only
working combination is webpack + `WATCHPACK_POLLING`; Turbopack has no polling escape hatch.

## Run (Linux, root, needs overlayfs)

```bash
./run.sh
```

The script installs the app, mounts `app/` through an event-less overlay at `mnt/`,
starts `next dev` from `mnt/`, rewrites `app/app/page.tsx` in place (the "host" edit),
and prints the HTML that the server still returns. Logs land in `logs/`.

Set `MODE=turbopack-polling`, `MODE=webpack` or `MODE=webpack-polling` (and `PORT=...`) to run the comparison rows.

## Docker variant (matches the original report)

```bash
docker compose up   # then edit app/app/page.tsx on the host
```

On Docker Desktop for Windows/macOS (or any VM-backed file sharing) the page keeps
rendering `MARKER_V1`. Note that on native Linux Docker, bind mounts *do* forward
inotify, so the bug does not appear there — use `run.sh` instead.
