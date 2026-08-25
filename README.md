# Repro for vercel/next.js#97844

Dynamic API route handler `app/api/[userId]/route.ts` (PUT) plus two static pages:

- `app/(hci)/cao/page.tsx`      -> URL `/cao`      (unrelated path, as described in the issue)
- `app/(hci)/api/cao/page.tsx`  -> URL `/api/cao`  (actual URL collision with `/api/[userId]`)

## Run

```bash
npm install

# dev
npm run dev
curl -i -X PUT http://localhost:3000/api/abc   # 200 JSON from route handler
curl -i -X PUT http://localhost:3000/api/cao   # 200 text/html -> the PAGE handled it

# prod
npm run build && npm start
curl -i -X PUT http://localhost:3000/api/abc   # 200 JSON from route handler
curl -i -X PUT http://localhost:3000/api/cao   # 405 Method Not Allowed, Allow: GET/HEAD
```

## Findings (Next.js 16.3.0, Turbopack)

- The behavior described in the issue (a static page on an *unrelated* URL such as
  `/cao`) does NOT reproduce: `PUT /api/cao` returns 200 JSON from the handler in
  both `next dev` and `next start`. Delete `app/(hci)/api/` to verify.
- The 405 only happens when a route group places a static page on the *same* URL as
  the dynamic route (`app/(hci)/api/cao/page.tsx` -> `/api/cao`). The static page
  then shadows the dynamic route handler.
- `next build` does not report this page/route-handler conflict.
- dev and prod disagree for the colliding path: dev returns 200 HTML for `PUT`,
  prod returns 405 with `Allow: GET, HEAD`.
