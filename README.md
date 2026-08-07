# Repro: Turbopack removes `notFound()` guard (vercel/next.js#96944)

next 16.3.0, `next build` (Turbopack).

```bash
npm install
npm run build
npx next start -p 3111
curl -s -o /dev/null -w "%{http_code}\n" -H "x-forwarded-host;" "http://localhost:3111/?v="   # 500 (expected 404)
curl -s -o /dev/null -w "%{http_code}\n" -H "x-forwarded-host;" "http://localhost:3111/?v=b"  # 500 (expected 404)
curl -s -o /dev/null -w "%{http_code}\n" -H "x-forwarded-host;" "http://localhost:3111/?v=c"  # 404 ok
curl -s -o /dev/null -w "%{http_code}\n" -H "x-forwarded-host;" "http://localhost:3111/?v=d"  # 404 ok
```

Grep the built chunk:

```bash
grep -o 'async function j(){[^}]*}' $(grep -rl 'example.com/' .next/server/chunks/ssr/*.js)
```

On 16.3.0 it prints `async function j(){return await i()}` — the `if (!t) notFound()` guard
(and the `throw` in `brokenGuardWithThrow`) is gone, so the page renders `null.name` -> 500.

Fixed on `next@16.3.1-canary.7`: the guard is emitted (`async function j(){let a=await i();return a||(0,d.notFound)(),a}`) and all four variants return 404.
