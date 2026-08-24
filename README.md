# Reproduction: Turbopack `next build` saturates a 4 GB host and stalls (vercel/next.js#97800)

Docker-less mirror of https://github.com/shunkakinoki/next-turbopack-build-memory-reproduction
(the upstream harness only runs through `docker run`, which is unavailable in the maintainer sandbox).
It generates the same synthetic fixture and runs `next build` directly on a host that already has
**2 CPUs, 4 GB RAM, no swap**, sampling host RSS and `MemAvailable` once per second.

## Run

```bash
npm install --no-audit --no-fund
bash scripts/run-local.sh canary            # 100 routes x 120 client modules = 12,000 modules
```

Green control (8,000 modules) on the same host:

```bash
REPRO_COMPONENTS_PER_ROUTE=80 bash scripts/run-local.sh 16.3.2
```

Build is bounded to 180 s (`BUILD_TIMEOUT_SECONDS`), so exit `124`/`137` means the build never left
`Creating an optimized production build ...`.

## Observed on a 2 vCPU / 4 GB / no-swap Linux x64 sandbox

| next | client modules | result | peak host RSS | samples with <100 MiB available |
| --- | --- | --- | --- | --- |
| 16.4.0-canary.4 | 12,000 | killed at the 180 s bound, exit 137, still compiling | 3,939 MiB | 51 |
| 16.3.2 | 12,000 | timed out at the 180 s bound, exit 124, still compiling | 3,968 MiB | 67 |
| 16.3.2 | 8,000 | `✓ Compiled successfully in 69s`, exit 0 | 3,944 MiB | — |

`reactCompiler` / `experimental.turbopackRustReactCompiler` can be disabled with
`REPRO_REACT_COMPILER=false`; the upstream report shows saturation persists without them.
