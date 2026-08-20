# Repro for vercel/next.js#72136 — no public API to read searchParams / request URL in a Server Action

Docs gap: `next/headers` exposes only `cookies`, `headers`, `draftMode`; `next/server` exposes no
accessor for the current request URL. A Server Action POST is sent to the page URL (query string
included) but the action has no documented way to read it.

## Run

```
npm install
npm run dev   # then open http://localhost:3000/sign-in?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fadmin and submit
```

The action in `app/sign-in/actions.ts` logs, server-side:

- `next/headers exports: cookies,headers,draftMode,default`
- `next/server exports: NextRequest,NextResponse,ImageResponse,userAgentFromString,userAgent,URLPattern,after,connection,default`
- `header next-url: null`, `header referer: http://localhost:3000/sign-in?callbackUrl=...` (only indirect source)
- internal `workUnitAsyncStorage` store: `url: {"pathname":"/sign-in","search":"?callbackUrl=..."}`

Same output with `npm run build && npm start` (the page stays static: `○ /sign-in`).
Verified on next@16.3.1-canary.25.
