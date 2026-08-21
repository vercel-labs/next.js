# Repro: `getVersionInfo` fails behind corporate firewalls (vercel/next.js#85071)

`getVersionInfo()` in `packages/next/src/server/dev/hot-reloader-shared-utils.ts`
fetches `https://registry.npmjs.org/-/package/next/dist-tags` unconditionally.
A TLS-intercepting corporate proxy answers that request with an HTML block page
and status 200, so `res.ok` is true and `await res.json()` throws. The outer
`catch` does `console.error(e)`, printing a bare, context-free stack:

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>)
```

The registry configured in `.npmrc` is never used, even though
`packages/next/src/lib/helpers/get-registry.ts` already exists for that purpose.

## Run (Linux, root, ports 443 + 3000 free)

```bash
npm install
npx playwright install chromium chromium-headless-shell
./run-repro.sh
```

Logs land in `./logs/`.
