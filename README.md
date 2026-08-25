# Repro attempt for vercel/next.js#97849 — Turbopack dev livelock (pnpm workspace monorepo)

Mirror of the reporter's repro (https://github.com/koding88/repro-turbo-livelock @ `00f5e00`) with the
defects that made it unrunnable repaired, so maintainers can actually exercise it.

## Repairs applied to the original repro

1. `packages/ui/package.json` — `exports["."]` pointed at `./src/index.ts`, but the file is
   `src/index.tsx` → every route failed with `Module not found: Can't resolve '@repo/ui'`.
2. `packages/ui/src/index.tsx` — the `Table` component had unbalanced JSX
   (`</td>)})}</tr>`) → `Parsing ecmascript source code failed: Unknown regular expression flags`.
3. `pnpm-workspace.yaml` — allow the `sharp` build script so `pnpm exec turbo run dev` does not
   abort with `ERR_PNPM_IGNORED_BUILDS` before starting `next dev`.

As published by the reporter, `GET /` returns **HTTP 500 (build errors)** in ~2.8s, not the
described hang.

## Run

```bash
pnpm install
pnpm exec turbo run dev      # -> next dev --turbo -p 3137
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3137/
```

## Result observed in this environment (linux x64, Node 24, pnpm 11.20.0)

| next | `GET /` | CPU after request | RSS |
|---|---|---|---|
| 16.2.11 (Turbopack) | **200 in 2.1s** | 19 CPU ticks / 60s (~0.3% of one core) | ~460 MB → 660 MB after all 8 routes |
| 16.3.2 (Turbopack) | **200 in 1.8s** | 352 ticks / 50s (compile only, then idle) | ~297 MB |

All 8 routes (`/`, `/about`, `/blog`, `/contact`, `/dashboard`, `/docs`, `/products`, `/settings`)
return 200 in 0.29–0.34s. No livelock, no runaway CPU, no unbounded RSS growth.

The reported livelock is claimed to be **darwin-arm64 only** (the issue itself notes Linux was
reported immune), so this environment cannot confirm or refute the platform-specific spin; it only
shows the repro does not run as published and shows no pathological behavior once repaired.
