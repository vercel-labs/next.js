# Repro: next.js#54685 — `useSyncExternalStore` without `getServerSnapshot` hard-errors instead of falling back to client rendering

Next.js `16.3.1-canary.25`, React 19.2.0.

## Run

```bash
npm install
npm run dev   # GET / -> HTTP 500
npm run build # build fails (prerender error) for both /
              # (pages/index.js) and /app-router-demo (app/app-router-demo/page.js)
```

## Expected

Per https://react.dev/reference/react/useSyncExternalStore#adding-support-for-server-rendering
the third `getServerSnapshot` argument is optional; the component should fall back to
client rendering.

## Actual

```
Error: Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.
```

Dev returns HTTP 500 for `/`; `next build` exits 1 with `Export encountered an error on /`.
