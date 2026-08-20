# Repro: vercel/next.js#43810 — cannot import `react-dom/server` in a Server Component

```
npm install
npm run dev
# open http://localhost:3000
```

Observed on next@16.3.1-canary.25 (Turbopack):

```
⨯ ./app/page.js:1:1
Error: You're importing a component that imports react-dom/server. To fix it, render or
return the content directly as a Server Component instead for perf and security.
> 1 | import ReactDOMServer from 'react-dom/server'
```

GET / returns HTTP 500 with error code E394.
