# next.js#77624 — 15.1.7 vs 15.2.4 `next build` timing harness

Source app is the reporter's repro (https://github.com/abhi2425/nextv15.2.4-build-issue,
`frontend/`, commit 9f661472e8b53a4bc063a5f748f6a31ea4de02e0) — a default create-next-app
with Tailwind v4. Note it does **not** set `output: "standalone"` as the issue states.

## Run

```bash
./compare.sh host          # both versions, bare app
./compare.sh host 1        # both versions, 40 routes x 40 client components
./compare.sh docker        # same, inside node:22-alpine (needs a Docker daemon)
./compare.sh docker 1
```

## Measured (Linux x64 container, 2 vCPU / 4 GB, Node 24, glibc, no Docker daemon available)

| case | next@15.1.7 | next@15.2.4 |
| --- | --- | --- |
| reporter's app as-is | 17s | 16s |
| scaled (40 routes x 40 client components) | 24s (peak ~899 MB RSS) | 22s (peak ~912 MB RSS) |

No regression observed; the reporter's 517s compile was not reproducible outside their
Docker/alpine + pnpm-monorepo + BuildKit-cache-mount setup.
