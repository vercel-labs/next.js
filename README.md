# Repro: Impossible to server-render Client Components in App Router Route Handlers

Upstream issue: https://github.com/vercel/next.js/issues/68150

`app/api/route.tsx` imports a `"use client"` component and tries to render it with
`renderToReadableStream` from `react-dom/server.browser`. Inside a Route Handler the
import resolves to a client reference proxy, not the real component, so React throws.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/api   # 500
```

Also fails for `npm run build && npm start`.

Expected: static HTML for the client component (works in plain React SSR).
Actual: `Error: Cannot access WithState.prototype on the server. You cannot dot into a
client module from a server component. You can only pass the imported name through.`
and HTTP 500.
