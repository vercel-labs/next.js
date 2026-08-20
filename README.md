# Repro: `createContext only works in Client Components` (vercel/next.js#60877)

```
npm install
npm run dev
curl -s -o /dev/null http://localhost:3000/ctx     # createContext error
curl -s -o /dev/null http://localhost:3000/router  # next/router in RSC error
```

`/ctx` — a Server Component imports a module that calls `React.createContext` at
module scope without `"use client"` (this is what packages such as
`next-redux-wrapper` v8 or `@emotion/styled` do internally). `vendor-ctx/` is a
local file dependency standing in for such a package.

Next.js 16.3.1 (Turbopack) server output:

```
⨯ TypeError: React.createContext is not a function
    at module evaluation (vendor-ctx/index.js:3:19)
⨯ TypeError: createContext only works in Client Components. Add the "use client" directive at the top of the file to use it.
   Read more: https://nextjs.org/docs/messages/context-in-server-component
    at module evaluation (vendor-ctx/index.js:3:19)
    at module evaluation (app/ctx/lib.js:4:1)
    at module evaluation (app/ctx/page.js:1:1)
```

`/router` — the original report's stack came from `next/router` reaching the RSC
graph. On current Next.js that path now yields a dedicated, actionable error:

```
⨯ ./app/router/lib.js:3:1
Error: You have a Server Component that imports next/router. Use next/navigation instead.
Import trace:
  Server Component:
    ./app/router/lib.js
    ./app/router/page.js
```
