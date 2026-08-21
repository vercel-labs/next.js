# Reproduction attempt for vercel/next.js#91798

Dev server silently exits (code 0) with `cacheComponents: true` + Turbopack.

## Run

```bash
npm install
npx next dev -p 3010     # then: curl -i http://localhost:3010/
```

## Result observed in a Linux x64 container (Node 24.11.0 and Node 24.17.0, next 16.2.0)

The dev server does **not** exit. It prints `Ready`, `- Cache Components enabled`, stays
alive, and serves `GET / 200`. The same is true for the reporter's own repository
(`styled-components/styled-components-website` @ c03d2925ab44f447b385d2f463fe971de2e15c7c)
after pinning `next@16.2.0` and adding `cacheComponents: true`.

Also tried, all still alive:
- Node 24.11.0 (reporter's version) instead of the container default 24.17.0
- deliberately mismatched native binary (`next@16.2.0` + `@next/swc-linux-x64-gnu@16.2.6`)
  to emulate the stale-lockfile theory from the issue comments

The reported silent exit therefore appears specific to darwin/arm64 (or to that machine's
lockfile state); the issue comments report it disappears on 16.2.1+ and after regenerating
the lockfile and deleting `.next`.
