# Repro harness for vercel/next.js#80234

`next/dynamic` conditionally importing client components — is "both chunks shipped"
a Next.js 15 regression?

The reporter's repository compares two **different** programs on its two branches, so it
cannot show a version regression. This harness keeps **one** source tree and only swaps
the Next.js version, and it contains both code shapes side by side:

- `/server-cond` — `next/dynamic()` used inside a **Server Component** page, conditionally
  rendering `WrapperA` / `WrapperB` (each wrapping a client component). This is the shape on
  the reporter's Next.js **15** branch.
- `/client-cond` — `next/dynamic()` used inside a **Client Component** (`Wrapper.tsx`),
  conditionally rendering `ClientA` / `ClientB`. This is the shape on the reporter's Next.js
  **14** branch.

`ClientA` / `ClientB` log at module scope, so the browser console proves which client
module was actually downloaded *and evaluated*.

## Run

```bash
npm install
npx playwright install chromium

# Next.js 15
npm run use:15 && npm run build && npx next start -p 3000 &
npm run probe

# Next.js 14
npm run use:14 && npm run build && npx next start -p 3000 &
npm run probe
```

Optionally grep the referenced chunks directly:

```bash
grep -o '/_next/static/[^"]*\.js' .next/server/app/server-cond.html
grep -rc 'CLIENT B' .next/static/chunks/app/server-cond/
```

## Measured result (identical on 14.2.28 and 15.3.3)

```
### /server-cond
  console: ["MODULE ClientA evaluated","MODULE ClientB evaluated","ClientA rendered"]
### /client-cond
  console: ["MODULE ClientA evaluated","ClientA rendered"]
```

So the "both client components shipped" behaviour depends on **where `dynamic()` is called**
(Server Component vs Client Component), not on the Next.js major version. In the Server
Component case, both wrappers' client references are merged into the page's client entry
chunk on 14.2.28, 15.0.0-canary.147, 15.0.0-canary.148, 15.3.3 and 16.3.1 alike.
