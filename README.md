# Repro: `encode` option ignored by cookie setters (vercel/next.js#64346)

Next.js `canary` (verified on 16.3.1-canary.25). Cookie values are always
`encodeURIComponent`-encoded; the `encode` option is ignored (and absent from the types).

## Run

```bash
npm install
npm run dev
# server action (Playwright or click the button on http://localhost:3000)
curl -sD - -o /dev/null http://localhost:3000/api/route-set | grep -i set-cookie
curl -sD - -o /dev/null http://localhost:3000/mw | grep -i set-cookie
```

## Observed

```
set-cookie: rh_cookie=qwerty123%3D; Path=/     # cookies().set(..., { encode: String })
set-cookie: mw_cookie=qwerty123%3D; Path=/     # NextResponse.cookies.set(..., { encode: String })
set-cookie: sa_cookie=qwerty123%3D; Path=/     # server action cookies().set(..., { encode: String })
```

Expected `qwerty123=`. `npx tsc --noEmit` passes with the `@ts-expect-error` comments,
i.e. `encode` is not part of the public option types.
Root cause: bundled `@edge-runtime/cookies` `serialize()` hardcodes `encodeURIComponent`.
