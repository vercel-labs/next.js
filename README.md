# Reproduction for vercel/next.js#58754

"Non-NextJS Error Boundary doesn't catch errors originating from server components."

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # http://localhost:3000
npm run verify         # in a second terminal, checks all three routes in a real browser
```

Routes:
- `/` – custom class `ErrorBoundary` (client component) wrapping a Server Component that throws
- `/client-variant` – same boundary wrapping a Client Component that throws (control)
- `/with-error-file` – Next.js `error.js` segment boundary + throwing Server Component (control)

## Result

Next.js `14.0.4-canary.9` (version in the report), dev mode:

```
UNCAUGHT | custom ErrorBoundary + throwing SERVER component | body=""
CAUGHT   | custom ErrorBoundary + throwing CLIENT component
CAUGHT   | error.js segment boundary + throwing SERVER component
```

Next.js `16.3.1-canary.25` (current canary), dev mode:

```
CAUGHT   | custom ErrorBoundary + throwing SERVER component | body="Custom ErrorBoundary caught: boom from server component"
CAUGHT   | custom ErrorBoundary + throwing CLIENT component
CAUGHT   | error.js segment boundary + throwing SERVER component
```

The initial dev-mode HTML document is the `__next_error__` 500 document in all three cases
(including with `error.js`); the boundary fallback renders after the client re-render.
So a user-land error boundary now behaves the same as `error.js` for server component throws.
