# Repro: vercel/next.js#53987

Pages Router: throwing inside a `<Suspense>` boundary on the server (the documented
React pattern for client-only content) renders the fallback correctly, but the Next.js
dev overlay reports a "Recoverable Error" popup / issue badge.

## Run

```bash
npm install
npm run dev   # open http://localhost:3000
```

## Observed (next@16.3.1-canary.25, react 19)

- SSR HTML contains the fallback (`Loading (fallback)...`) — correct per React docs.
- Client hydration renders the real content.
- Dev overlay shows `1 Issue` and a "Recoverable Error" dialog:
  `Switched to client rendering because the server rendering errored: this component only works on client`
- `next build && next start` renders the fallback with no user-facing error (no overlay in prod).

## Expected

No dev error overlay for the intentional, documented server-error -> fallback pattern
(or an opt-out).
