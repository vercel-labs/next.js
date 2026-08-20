# Repro: graceful shutdown signal handling in the App Router (vercel/next.js#51404)

Next.js 16.3.1, Node 24.17. App Router only app, `NEXT_MANUAL_SIG_HANDLE=true`.

```bash
npm install
npm run build
./run-test.sh            # next start  + SIGTERM  (handlers DO run, async cleanup completes)
./run-test-dev.sh        # next dev    + SIGTERM  (handler starts, process dies before it finishes)
./run-test-norequest.sh  # next start + SIGTERM with no request served
```

Findings:
1. `next start`: both the `instrumentation.js` `register()` handler and a module-scope
   handler in `app/layout.js` fire, and the async 3s cleanup runs to completion.
2. `next dev`: the handler fires but the process exits after ~1s, so
   `[instrumentation] drain finished after 3s` is never printed.
3. The documented location (`pages/_document.js`, see `docs-approach-pages/_document.js`)
   cannot even be used: copying it to `pages/_document.js` in this App Router app makes
   `next build` fail with `Error [PageNotFoundError]: Cannot find module for page: /_document`.
