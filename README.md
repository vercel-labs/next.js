# Repro: response cookies set in a Server Action are not visible in middleware (vercel/next.js#65179)

Reporter's linked repo (marcospassos/next-middleware-cookie-bug) is the unmodified
bug-report template: it has no `middleware.ts` and no server action, so it does not
reproduce anything. This is a minimal reproduction of the reported behavior.

- `app/actions.ts` – server action calling `cookies().set('foo', 'bar')`
- `middleware.ts` – logs `NextResponse.next().cookies` for every request
- `app/page.tsx` – form that submits the server action

## Run

```bash
npm install
npm run dev          # http://localhost:3000
# click "set cookie in server action", then watch the dev server output
```

Optional automated check (needs `npm i -D playwright && npx playwright install chromium`):

```bash
node verify.mjs
```

## Observed (next@16.3.1-canary.25, Node 24)

Middleware log for the server-action POST:

```
{"tag":"MIDDLEWARE","method":"POST","url":"/","isServerAction":true,
 "requestCookieFoo":null,"responseHasFoo":false,"responseCookies":[]}
```

while the HTTP response of that same POST does carry `Set-Cookie: foo=bar; Path=/`
and the cookie is present on subsequent requests (`requestCookieFoo":"bar"`).

## Expected per the report

`response.cookies` in middleware should reflect cookies set later by the server action
(`response.cookies.has('foo') === true`), so middleware can inspect/override them.
