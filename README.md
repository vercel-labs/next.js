# Reproduction: vercel/next.js#78429

`usePathname()` inside a client component rendered by the root layout re-renders
many times per navigation when the target route contains an `async` component
that `await`s, while navigating to non-async routes renders it once.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
# or: npm run build && npm start
```

Open the browser console, click the nav links, and count the `header` logs.

- `Home`, `Page11` (no `await`): 1 `header` log per navigation (2 with Strict Mode).
- `Page23` / `Page36` (`await` in the server component): 3-12 `header` logs per navigation.

Observed with next@15.3.1 and next@16.3.1-canary.26 (`next dev`, and `next start`
for the dynamic `/page36` route).
