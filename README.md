# Repro: next.js#55894 — /404 and /500 not matched by dynamic `app/[id]/page.tsx` in production

```
npm install
npm run build && npm start   # then: curl -i localhost:3000/404  -> built-in not-found page (404)
npm run dev                  # then: curl localhost:3000/404     -> "Page 404"
```

Expected: `/404` and `/500` render the dynamic route (as dev does).
Actual (next build/start and Vercel): built-in error pages are served.
