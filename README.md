# Repro: `next/og` ImageResponse fails on Arabic text (vercel/next.js#74897)

Next.js 16.3.1 (bundled `@vercel/og` with satori 0.25.0).

```bash
npm install
npm run dev
curl -v http://localhost:3000/og      # empty reply / 500, server logs satori error
curl -v http://localhost:3000/og-en   # 200 image/png (control)
```

Server log:

```
⨯ Error: failed to pipe response
  [cause]: Error: lookupType: 5 - substFormat: 3 is not yet supported
 GET /og 500
```

The client sees an empty reply from server (no body, connection closed), so a
`next/og` route with Arabic text renders nothing and gives no actionable error
to application code.
