# Reproduction — vercel/next.js#60941

`[webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT ... stat '.next/cache/webpack/<client|server>-development/N.pack.gz'`

The reporter's link (`oscarthroedsson/healthy`) is no longer public, so this is a minimal
reproduction of the same failure.

## Root cause demonstrated

Webpack's persistent cache writes numbered `N.pack.gz` files and an `index.pack.gz` that
points at them. Pack contents are read **lazily**: unread content is only read back when the
cache is persisted again ("unpack cache content N ... because it's outdated and need to be
serialized"). If anything outside webpack renames/removes a pack file while `next dev` runs —
which is exactly what iCloud Drive / Dropbox / OneDrive do when the project lives inside a
synced folder, producing the `1 2.pack.gz` duplicates in the issue's screenshots — the next
persist stats the vanished file and fails.

`run-repro.sh` emulates that sync agent by renaming `N.pack.gz` to `N 2.pack.gz` once, right
after the dev server is ready and before the first cache persist.

## Run

```bash
npm install
./run-repro.sh
```

Phase 1 builds a multi-pack warm cache (3 short dev sessions), phase 2 restarts `next dev`,
phase 3 renames the pack files, phase 4 compiles a route so webpack persists again.

## Observed on next@15.4.5, node v24.17.0 (Linux)

```
[Error: ENOENT: no such file or directory, stat '<project>/.next/cache/webpack/server-development/1.pack.gz'] {
  errno: -2, code: 'ENOENT', syscall: 'stat',
  path: '<project>/.next/cache/webpack/server-development/1.pack.gz'
}
 ⨯ unhandledRejection: [Error: ENOENT: ... server-development/1.pack.gz']
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, stat '<project>/.next/cache/webpack/server-development/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, stat '<project>/.next/cache/webpack/client-development/1.pack.gz'
```

Matches the issue byte for byte, including the mixed `client-development` /
`server-development` paths in consecutive lines.

Optional: rename `next.config.verbose.js.txt` to `next.config.js` for
`infrastructureLogging` verbose PackFileCache logs.

## Notes

* Not reproducible on `next@canary` (16.3.1-canary.25): `next dev` defaults to Turbopack, and
  even with `next dev --webpack` no `.next/cache/webpack` directory is created.
