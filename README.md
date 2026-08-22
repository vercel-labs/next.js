# Reproduction for vercel/next.js#68177

`next dev` (webpack) crashes with
`TypeError [ERR_INVALID_ARG_VALUE]: The argument 'path' must be a string, Uint8Array, or URL without null bytes`
when a dependency was installed by pnpm from a git URL.

pnpm (<= v9) names the virtual-store directory after the dep path, e.g.
`@my+pkg-...@git+file++++...+pkg#<commit>`. Next.js' dev-only `vendor` splitChunks
cache group uses that directory name verbatim as the chunk name
(`packages/next/src/build/webpack-config.ts`, `extractRootNodeModule`), so the
emitted file is `vendor-chunks/<name>.js`. webpack treats the `#` as a resource
fragment and escapes it with a NUL byte, which then reaches `fs.stat`.

Neither a private repo nor GitHub is required: any git dependency whose pnpm
directory name keeps a `#` triggers it. Public GitHub deps resolved to a
codeload tarball, npm installs, pnpm >= 10 (which replaces `#` with `+`) and
Turbopack are all unaffected.

## Run

```bash
./setup.sh          # creates the local git package + pnpm install
pnpm dev            # next dev --webpack
curl http://localhost:3000/
```

Observed: the dev server prints the `ERR_INVALID_ARG_VALUE` uncaught exception
and never emits the vendor chunk. Verified with next 14.2.5 and next 16.3.2
(webpack); `next dev` with Turbopack works.
