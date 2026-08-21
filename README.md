# Repro: escaping Parallel Routes `@folder` for literal `@scope` URL segments (issue #79141)

Next.js 16.3.1 (also App Router in 15.x). `app/@grida/pixel-grid/page.tsx` is interpreted as a
parallel-route slot `@grida`, so `/@grida/pixel-grid` 404s and there is no documented escape for a
literal `@` path segment.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/@grida/pixel-grid   # 404
curl -i http://localhost:3000/pixel-grid          # 404 in dev
npm run build                                     # route table lists /pixel-grid and /%40try/pixel-grid
npm start
curl -i http://localhost:3001/@grida/pixel-grid   # 404
curl -i http://localhost:3000/pixel-grid          # 200 in prod (slot child leaked as a route)
curl -i http://localhost:3000/%40try/pixel-grid   # 200 only when the client sends %40
```

`app/%40try/pixel-grid/page.tsx` shows the only current workaround: it serves `/%40try/pixel-grid`
but not `/@try/pixel-grid`, so an unencoded `@` in the browser address bar still 404s.
