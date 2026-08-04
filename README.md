# Repro: `output: 'standalone'` + Turbopack + Vercel adapter -> ENOENT `.next/next-server.js.nft.json`

Issue: https://github.com/vercel/next.js/issues/96646

Next 16.3 no longer emits `.next/next-server.js.nft.json` when the build runs with the
Vercel build adapter (`NEXT_ADAPTER_PATH`, enabled by `@vercel/next` >= 4.21 on Vercel),
but `output: 'standalone'` still runs `copyTracedFiles()` which reads that file, so the
build fails right after `Running onBuildComplete from Vercel`.

## Run

```bash
npm install
NEXT_ENABLE_ADAPTER=1 npx vercel@latest build --prod
```

(`NEXT_ENABLE_ADAPTER=1` is what turns on the same adapter code path the Vercel build
container uses; `.vercel/project.json` is committed so the CLI can build offline.)

## Observed (next 16.3.0 and 16.3.1-canary.1)

```
  Running onBuildComplete from Vercel

> Build error occurred
Error: ENOENT: no such file or directory, open '<cwd>/.next/next-server.js.nft.json'
```

## Controls

| variant | result |
| --- | --- |
| next 16.3.0, adapter, `output: 'standalone'` | FAIL (ENOENT) |
| next 16.3.0, adapter, no `output` | pass (and no `*.nft.json` is written at all) |
| next 16.3.0, adapter, standalone, `next build --webpack` | pass (`collect-build-traces` writes the file) |
| next 16.2.11, adapter, `output: 'standalone'` | pass (`.next/next-server.js.nft.json` written) |
| next 16.3.0, no adapter (plain `next build`), standalone | pass |
