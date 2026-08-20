# Repro: `next build` fails with `EISDIR: illegal operation on a directory, readlink ...`

Upstream issue: https://github.com/vercel/next.js/issues/45067

## Real-world condition

Reported as "can only build on drive `C:`". The actual trigger is the *filesystem*, not the
drive letter: on Windows, `fs.readlink()` on a filesystem without symlink support
(exFAT / FAT32 - typical for secondary/external drives) fails with `EISDIR` instead of
`EINVAL`/`UNKNOWN`. Next.js only tolerates `EINVAL`, `ENOENT` and `UNKNOWN`, so the webpack
build aborts with:

```
Failed to compile.
Error: EISDIR: illegal operation on a directory, readlink 'D:\...\pages\_app.tsx'
```

## Running it without an exFAT Windows drive

`simulate-no-symlink-fs.js` patches `fs.readlink*` to fail with `EISDIR` for paths inside the
project (exactly what libuv does on exFAT on Windows), so the bug is reproducible on any OS.

```bash
npm install
npm run repro     # => Failed to compile. Error: EISDIR ... readlink '<cwd>/pages/_app.tsx'
npm run build     # control run, succeeds
```

## Where it throws

1. webpack/enhanced-resolve symlink resolution (`resolve.symlinks`, default `true`)
2. `packages/next/src/build/webpack/plugins/next-trace-entrypoints-plugin.ts` -> `readlink()`
   only swallows `EINVAL | ENOENT | UNKNOWN`; adding `EISDIR` (as
   `collect-build-traces.ts` already does) is needed here too. Setting
   `config.resolve.symlinks = false` in `next.config.js` only moves the failure to this plugin.
