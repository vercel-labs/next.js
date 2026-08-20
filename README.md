# Repro: examples/with-docker Dockerfile does not copy `.yarnrc` / `.yarnrc.yml`

Issue: https://github.com/vercel/next.js/issues/71827

`examples/with-docker/Dockerfile` now copies `.npmrc*` (covers npm/pnpm) but still
never copies `.yarnrc` / `.yarnrc.yml`. Yarn Berry reads registry and auth settings
**only** from `.yarnrc.yml`, so any project using a private/scoped registry with Yarn
cannot be built with the example Dockerfile.

Run: `./reproduce.sh` (needs Docker with buildx + Node for the publish helper).

Results observed with next@15.0.3, yarn@4.5.1, node:24.13.0-slim:

| Dockerfile | Result |
| --- | --- |
| `Dockerfile` (verbatim canary example) | fails: `Invalid option name ("--production=false")` — Yarn Berry rejects `yarn install --frozen-lockfile --production=false` |
| `Dockerfile.flags-fixed` (`yarn install --immutable`) | fails: `YN0035: @repro/private-lib@npm:1.0.0: Package not found ... https://registry.yarnpkg.com/...` because `.yarnrc.yml` is missing in the image |
| `Dockerfile.fixed` (`COPY ... .npmrc* .yarnrc* .yarnrc.yml* ./`) | builds, image serves the private dependency |
