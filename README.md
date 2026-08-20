# Reproduction for vercel/next.js#47394

`[webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: Unable to snapshot resolve dependencies`

## Run

```bash
# as a non-root user
bash repro.sh
```

## What it does

Copies this tiny App Router app into ``.repro-work/execute-only-parent/app``,
installs `next@canary`, sets the *parent* directory to mode `0111`
(traversable but not readable by the build user), and runs `next build --webpack`.

## Observed (next@16.3.1-canary.25, Node 24.17.0)

```
[webpack.cache.PackFileCacheStrategy/webpack.FileSystemInfo] Error snapshotting file timestamp hash combination of <parent>: Error: EACCES: permission denied, open '<parent>'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: Unable to snapshot resolve dependencies
```

`.next/cache/webpack` is never created, so the webpack build cache is silently
disabled for every build. Making the parent directory readable
(`chmod 0711 -> 0755`) removes the warning and the cache is written (~45 MB).

Notes:
- Requires a custom `webpack` function in `next.config.js`; without it, canary
  writes the cache successfully even with the unreadable ancestor.
- Reproduces identically on `next@15.0.1`, `15.1.8`, `15.4.7`, `16.0.0` and canary.
