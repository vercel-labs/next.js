# Repro: vercel/next.js#89851

Turbopack `next build` writes `serverExternalPackages` shims into
`.next/node_modules/<pkg>-<hash>` as **relative** symlinks whose `../` depth
matches the build-time directory depth. Copying `.next` to a shallower path
(the normal multi-stage Docker `COPY --from=builder` pattern in a monorepo with
hoisted `node_modules`) makes the symlink overshoot `/` and the server 500s.

## Run

Docker (original report): `docker build -t repro . && docker run -p 3000:3000 repro`, then `curl localhost:3000/`.

Docker-free (verified in this environment, needs root + Node 20+): `bash reproduce.sh`

## Observed with next@16.1.6

```
Builder: /wsbuild/app/.next/node_modules/pino-28069d5257187539 -> ../../../node_modules/pino   (OK,  HTTP 200)
Runtime: /app/.next/node_modules/pino-28069d5257187539        -> ../../../node_modules/pino   (BROKEN, HTTP 500)

⨯ Error: Failed to load external module pino-28069d5257187539: Error: Cannot find module 'pino-28069d5257187539'
```

Fixing only the symlink (`ln -sfn ../../node_modules/pino .next/node_modules/pino-28069d5257187539`)
restores HTTP 200 **without** `NODE_PATH`, so the hashed module name itself resolves fine;
the only defect is the depth-sensitive relative symlink.
