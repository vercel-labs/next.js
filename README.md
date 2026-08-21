# Repro for vercel/next.js#82625 — `Collecting build traces` is ~2.5x slower when the project is not at the filesystem root

Minimal, self-contained reproduction of
https://github.com/vercel/next.js/issues/82625 (reported against
`successible/cleanslate` in Docker with/without `WORKDIR /app`).

Layout mirrors the reporter's project: dependencies/lockfile at `<root>/`, the
Next.js app in `<root>/src` (pages router, `output: 'export'`).

## Run (no Docker needed)

```bash
bash repro.sh            # builds at / then at /app
bash repro.sh /app /     # reverse order (results are order independent)
```

The script installs the same `package.json` twice, runs `next build` in
`<root>/src`, and prints the `node-file-trace-build` span duration
(the `Collecting build traces ...` step) taken from `.next/trace`.

With Docker instead: `docker build -f Dockerfile .` (WORKDIR, slow) vs
`docker build -f Dockerfile.no-workdir .` (no WORKDIR, fast).

## Measured (Linux x64, 2 vCPU, next@15.3.5, identical dependency tree)

| project location                  | `node-file-trace-build` |
| --------------------------------- | ----------------------- |
| `/src` (no `WORKDIR`)             | 7.89s / 7.82s           |
| `/app/src` (`WORKDIR /app`)       | 19.35s / 19.53s         |

The emitted trace is effectively the same in both runs
(`.next/next-server.js.nft.json`: 766 vs 763 files), so the slow run is not
tracing more files — it is the same work taking ~2.5x longer.

## Notes gathered while reproducing

- The Next.js version is not the trigger: on the reporter's own project
  (`successible/cleanslate`) `node-file-trace-build` was 13.44s on `15.3.5` and
  14.65s on `15.4.6`, both at `/app/src`, versus 7.84s for `15.3.5` at `/src`.
- Setting `outputFileTracingRoot: '/'` for the `/app/src` project does **not**
  help (14.01s), so the value of the tracing root is not the cause.
- `next@15.4.6` cannot be built at the filesystem root at all:
  `findRootDir` (`next/dist/lib/find-root.js`) loops forever because
  `dirname(dirname('/pnpm-lock.yaml')) === '/'` keeps re-finding the same
  lockfile, so the build hangs before printing the banner and dies with
  `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of
  memory` (this is vercel/next.js#82577, fixed by #82590). That is why this
  repro pins `next@15.3.5` for the root permutation.
