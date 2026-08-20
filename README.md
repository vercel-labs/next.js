# Repro: draft mode `__prerender_bypass` cookie uses `SameSite=lax` in dev

Repro for https://github.com/vercel/next.js/issues/49927 (repaired copy of
https://github.com/fromthemills/nextjs-draft-bug, whose `draftMode().enable()` throws on
current canary because `draftMode()` is now async).

## Run

```bash
npm install
npm run dev &          # http://localhost:3000
npm run check          # GET /api/draft, prints Set-Cookie
```

Dev output (Next.js 16.3.1-canary.25):

```
set-cookie: __prerender_bypass=...; Path=/; HttpOnly; SameSite=lax
```

Production is different — `SameSite=none; Secure` is used:

```bash
npm run build
npm run start &        # http://localhost:3001
npm run check http://localhost:3001/api/draft
# set-cookie: __prerender_bypass=...; Path=/; Secure; HttpOnly; SameSite=none
```

Source: `sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax'` in
`server/async-storage/draft-mode-provider.ts` and `server/api-utils/index.ts`,
so cross-origin CMS iframes cannot set the cookie while developing locally.
