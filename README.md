# Repro: parallel server action calls are serialized (vercel/next.js#69265)

Reporter's repo (https://github.com/yehonatanyosefi/parallel-routes-example) is 404 / unavailable,
so this is a minimal replacement.

## Run

```
npm install
npm run dev   # or: npm run build && npm start
# open http://localhost:3000, click "start"
```

`app/page.tsx` calls `Promise.all([slowAction('A'), slowAction('B')])`; each action sleeps 1000ms.

## Observed (Next.js 16.3.1, dev and production)

Client: `Promise.all of two 1s server actions took ~2050ms`.
Server log: `A START -> A END -> B START -> B END` (second POST is only sent after the first response).
Expected if parallel: ~1000ms.
