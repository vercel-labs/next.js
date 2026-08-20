# next#36774 — HMR / recompile does not work in Docker (no filesystem events)

Reproduction for https://github.com/vercel/next.js/issues/36774.

## Root cause being reproduced

Inside Docker Desktop the project is bind-mounted from the Windows/macOS host through
virtiofs / gRPC-FUSE. The mount happily *accepts* `inotify_add_watch` calls, but host-side
edits never produce inotify events inside the container, so neither Turbopack nor webpack
ever learns that a file changed. The page keeps serving the old output even after a hard
reload.

## Deterministic run (plain Linux, no Docker Desktop required)

`no-inotify-events.c` is a tiny `LD_PRELOAD` shim that reproduces exactly that condition:
watches succeed, events are never delivered, file contents/mtime are normal.

```bash
npm install
bash repro.sh    # needs gcc + curl
```

Observed with `next@16.3.1-canary.25` (Node 24, Linux):

| dev server | `watchOptions.pollIntervalMs` | result after editing `app/page.js` |
| --- | --- | --- |
| `next dev` (Turbopack) | unset | **NO RECOMPILE after 30s**, `/` still serves `MESSAGE_V1` |
| `next dev` (Turbopack) | `1000` | change picked up in ~2–4s, browser HMR updates |
| `next dev --webpack` | unset | **NO RECOMPILE after 30s** |
| `next dev --webpack` | `1000` | change picked up in ~2–4s |

Without the shim (normal Linux inotify) every case recompiles in ~2s, so the harness only
removes filesystem events — nothing else.

## Real Docker Desktop run (Windows/macOS host, original report)

```bash
docker compose up --build
# edit app/page.js on the host -> browser never updates
```

Add `watchOptions: { pollIntervalMs: 1000 }` to `next.config.js` to make it work
(this replaces the old `WATCHPACK_POLLING=true`, which is webpack-only).

## Notes for maintainers

- `watchOptions.pollIntervalMs` exists in `config-schema.ts` and is wired to both webpack
  (`poll`) and Turbopack (`watch.pollIntervalMs`), and it fixes the issue for both, but it
  is not mentioned anywhere under `docs/` on canary.
- `WATCHPACK_POLLING=true` has no effect on `next dev` with Turbopack (Turbopack does not
  read it), which matches the reports that "--turbopack ruins HMR inside Docker".
