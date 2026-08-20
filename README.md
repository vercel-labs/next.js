# Reproduction: next.js#60040 — custom server `conf` (distDir) ignored

`next({ dev, conf: { distDir: '.custom_dist' } })` in a custom server is ignored;
Next.js still builds into `.next`.

## Run

```bash
npm install
node server.js   # then open http://localhost:3600
ls -a            # `.next` exists, `.custom_dist` does not
```

Observed with next@16.3.1-canary.25, Node 24.
