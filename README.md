# Repro: webpack build cache never reused inside Docker (issue #73679)

`packages/next/src/server/cache-dir.ts` returns `undefined` when
`is-docker()` is true, so `.next/cache/.rscinfo` (which stores the build
encryption key) is never persisted. A new key is generated on every build,
which changes the webpack cache version and invalidates the restored
`.next/cache/webpack` pack files. CircleCI Docker executors and GitLab
dind hit this.

## Run

```bash
sudo ./repro.sh
```

`/.dockerenv` is created/removed to flip `is-docker()`; nothing else changes
between the two scenarios. `.next/cache` is kept between builds inside a
scenario (equivalent to a CI cache restore).

## Observed (next 16.3.1-canary.25, `next build --webpack`)

```
not-docker build 1: Compiled successfully in 6.0s | .rscinfo present: yes
not-docker build 2: Compiled successfully in 2.3s | .rscinfo present: yes
not-docker build 3: Compiled successfully in 2.2s | .rscinfo present: yes
docker     build 1: Compiled successfully in 6.3s | .rscinfo present: no
docker     build 2: Compiled successfully in 5.9s | .rscinfo present: no
docker     build 3: Compiled successfully in 6.2s | .rscinfo present: no
```

Stubbing the detection (`echo "module.exports = () => false" >
node_modules/next/dist/compiled/is-docker/index.js`) restores warm builds
inside Docker, confirming the cause.

Turbopack builds (the default in Next 16) are not affected.
