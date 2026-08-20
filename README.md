# Repro for vercel/next.js#39961 — `noPropertyAccessFromIndexSignature` vs `process.env.*`

`tsconfig.json` sets `noPropertyAccessFromIndexSignature: true`.
Tested with next@16.3.1, typescript@5.9.2.

## 1. Dot access on `process.env` fails type checking (reproducible)

```bash
npm install
npm run typecheck:dot
# dot-access.ts(3,38): error TS4111: Property 'NEXT_PUBLIC_FOO' comes from an
# index signature, so it must be accessed with ['NEXT_PUBLIC_FOO'].
```

The same error fails `next build` ("Failed to type check.") when the dot access
lives in an app file, so the flag forces bracket access in Next.js projects.

## 2. Bracket access IS still inlined (the assumed footgun does not apply)

`app/page.tsx` reads `process.env['NEXT_PUBLIC_FOO']` (value from `.env.local`).

```bash
npm run build && npm start
curl -s localhost:3000 | grep -o 'id="out">[^<]*'
# id="out">{"bracketAccess":"inlined-value"}
grep -rl inlined-value .next/static   # literal present in the client bundle
```

Verified the same inlining for bracket access on next@12.2.5 (webpack
DefinePlugin era): the built client chunk contains
`{dot:"inlined-value",bracket:"inlined-value"}`.
