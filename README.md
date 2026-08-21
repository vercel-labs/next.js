# Repro attempt for vercel/next.js#77882

`"url" parameter is not allowed` with next 13.5.11 and
`images.remotePatterns: [{ protocol: 'https', hostname: '**', port: '', pathname: '**' }]`.

## Run

```bash
npm i
npm run dev            # port 3000 (also: npm run build && npm start -> 3001, node server.js -> 3002)
./check.sh
```

## Result (Next.js 13.5.11)

- `next dev`, `next start`, and the custom server (`server.js`) all return **200 image/jpeg** for the
  vodafone.com.au URL from the issue, so the `**` remotePattern is honored: not reproduced.
- The second URL in the issue (`letsenhance.io/static/.../MainBefore.jpg`) is **404 at the origin**
  itself, so Next.js returns `"url" parameter is valid but upstream response is invalid` (404), which
  is not the reported error.
- `"url" parameter is not allowed` (400) only appears when the `images` config is not applied at all
  (reproduced here by temporarily removing `next.config.js`), which points at the config not being
  loaded in the reporter's custom-server/Lambda setup.
- `packages/next/src/shared/lib/match-remote-pattern.ts` and the `validateParams` `url` check are
  identical between v13.4.12 and v13.5.11.
