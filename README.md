# next#97802 — Turbopack production build saturates 4 GB and stalls or OOMs

Docker-free minimization of the reporter's harness for
https://github.com/vercel/next.js/issues/97802.

The original reproduction requires Docker + Bun to build the constrained
cgroup. This variant drops both: run it directly on a 2 CPU / 4 GB Linux
machine (or inside a cgroup with those limits) and the sampler reads the
memory numbers from the environment it is already in.

## Run

```bash
npm install
LABEL=canary-12000 bash scripts/run.sh
```

`scripts/run.sh` generates the fixture, runs `next build`, samples
`memory.current` and `MemAvailable` once per second, bounds the build to 180
seconds (`BUILD_TIMEOUT_SECONDS`), and prints exit status, elapsed time and
peak memory. Logs land in `results/`.

## Observed on next@16.4.0-canary.4, 2 CPU / 4283 MiB total, no swap

| Modules | Env | Result | Peak | Elapsed |
| ---: | --- | --- | ---: | ---: |
| 2,000 | default | exit 0, build completes | 2,050 MiB | 23 s |
| 8,000 | default | exit 137, killed in compilation | 4,044 MiB | 54 s |
| 12,000 | default | exit 137, killed in compilation | 4,021 MiB | 106 s |
| 12,000 | `REPRO_REACT_COMPILER=false` | exit 137, killed in compilation | 4,035 MiB | 249 s |

Every failing run stays on `Creating an optimized production build ...` and
never emits a further phase. `MemAvailable` fell below 100 MiB for 19
consecutive samples in the 12,000-module run before the kernel killed it.

Disabling `reactCompiler` and `experimental.turbopackRustReactCompiler` does
not avoid saturation, so the retained memory is not the React Compiler
transform.

## Fixture knobs

```bash
REPRO_ROUTES=100 REPRO_COMPONENTS_PER_ROUTE=120 REPRO_ROWS_PER_COMPONENT=96 \
  LABEL=my-run bash scripts/run.sh
```

Note: the upstream reproduction's `run-reproduction.sh` passes
`REPRO_COMPONENTS_PER_ROUTE=64`, so `bun run reproduce` builds 6,400 modules
rather than the 12,000 quoted in the issue body. `scripts/generate.mjs`
defaults to 120 (12,000 modules); this harness keeps that default so the
numbers match the issue text.
