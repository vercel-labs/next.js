# next.js#67542 — useRef value lost across Suspense retries (pages router SSR)

Minimal reproduction of https://github.com/vercel/next.js/issues/67542

The component caches a suspending promise wrapper in `useRef`. Because the component
suspends before it ever mounts, React throws away the render (including refs) and
retries from scratch, so the ref is always `false`/`null`, a brand new promise is
created, and SSR loops forever.

## Run

```bash
npm install
npm run dev   # http://localhost:3002
```

Watch the server terminal. Every line prints `false`; a guard throws after 200
renders so the request terminates instead of hanging forever.

Reporter's original app (Next 14.2.4) has no guard and logs millions of
`HELLO THERE ---> false` lines while `GET /` never responds.

Verified reproducing on next 16.3.1 / react 19.2.8 and next 14.2.4 / react 18.3.1.
