# Middleware redirect is silently swallowed for Server Action requests (#81732)

Reproduces the behavior behind https://github.com/vercel/next.js/issues/81732 with the exact
middleware snippet from the docs
(https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-middleware-optional).

## Run

```bash
npm install
npm run dev            # http://localhost:3000
# optional automated check (needs: npm i -D playwright && npx playwright install chromium)
node verify.mjs
```

Manual steps:
1. Open http://localhost:3000/dashboard, click "set session cookie", reload.
2. Click "call server action" -> `resolved: "action-ran"`.
3. Click "clear session cookie (simulate expiry)".
4. Click "call server action".

## Observed (next@16.3.1)

- Middleware runs for the Server Action POST, logs `redirecting to /login` and returns a 307.
- The browser follows the 307 with POST /login, receives the HTML document, and stays on /dashboard.
- The Server Action never executes (no `[server action] protectedAction RAN` in the server log).
- The client-side call rejects with `An unexpected response was received from the server.`

Expected: either the browser is navigated to /login, or the docs state that Server Action
requests must be excluded from the middleware matcher.
