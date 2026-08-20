# Reproduction for vercel/next.js#71101

Server Action / Server Component error messages are visible on the client in `next dev`
but replaced with the generic redacted React error (#441 "An error occurred in the Server
Components render...") in a production build. Only `error.digest` survives.

## Run

```bash
npm install
npm run dev &            # dev server on :3000
node check.mjs http://localhost:3000 dev
npm run build && npm start &   # prod server on :3001
node check.mjs http://localhost:3001 prod
```

`check.mjs` clicks the login button (server action that throws
`new Error('Invalid email or password')`) and loads `/rsc` (server component that throws),
printing what the client sees.

## Observed (next@16.3.1-canary.25)

```
[dev]  server action    -> caught: Invalid email or password | digest: 3236008614
[dev]  server component -> error.message: Invalid email or password (server component) | digest: 4068674261
[prod] server action    -> caught: Minified React error #441; ... | digest: 3010950272
[prod] server component -> error.message: Minified React error #441; ... | digest: 4081466523
```

The real messages are only printed in the server terminal in production.
