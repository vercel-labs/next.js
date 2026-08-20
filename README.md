# Repro: missing dependencies in `output: "standalone"` with pnpm (#48017)

Issue: https://github.com/vercel/next.js/issues/48017

## Run

```bash
pnpm install
./repro.sh
```

## What happens

`next build` with `output: "standalone"` under pnpm writes `.next/standalone/node_modules`
as a tree of **symlinks** into `.next/standalone/node_modules/.pnpm`.

* Copying the folder while preserving symlinks (`cp -a`, `tar` without `-h`, docker `COPY` of the
  whole `standalone` dir) -> server starts, HTTP 200.
* Copying the folder while **dereferencing** symlinks -> `node server.js` crashes immediately:

```
Error: Cannot find module '@swc/helpers/_/_interop_require_default'
Require stack:
- <dir>/node_modules/next/dist/shared/lib/constants.js
- <dir>/node_modules/next/dist/server/config.js
- <dir>/node_modules/next/dist/server/next.js
- <dir>/server.js
```

Dereferencing turns `node_modules/next` into a real directory, so Node no longer resolves
next's own dependencies from `node_modules/.pnpm/next@.../node_modules/*`.
Symlink dereferencing happens with BSD/macOS `cp -r`, `tar -czh`, `zip -r` (without `--symlinks`),
`rsync -L`, `actions/upload-artifact@v4` and several docker/CI artifact flows — i.e. exactly the
"build on one machine, deploy on another" workflow standalone output is meant for.

Verified with next `16.3.1-canary.24`, pnpm 11, Node 24 on Linux (originally reported on
next 13.2.5-canary.32 / pnpm 8, where macOS `cp -r` dereferences by default).

Workaround: `node-linker=hoisted` in `.npmrc`, or always transfer standalone output with
symlinks preserved.
