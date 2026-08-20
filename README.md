# Repro: docs claim "encrypted" sessions but the example only signs them

Issue: https://github.com/vercel/next.js/issues/69413

Docs page: https://nextjs.org/docs/app/guides/authentication
(section "2. Encrypting and decrypting sessions", source
`docs/01-app/02-guides/authentication.mdx`)

`lib/session.js` is copied verbatim from the docs. It uses `jose`'s `SignJWT` /
`jwtVerify`, which produce a **signed** JWS (`header.payload.signature`), not an
encrypted JWE (5 segments). The session payload is base64url-encoded plaintext,
so anyone holding the cookie can read `userId`, `role`, `email`, etc. without
the `SESSION_SECRET`.

## Run

```bash
npm install
npm run verify          # standalone: prints the payload decoded without the secret
# or, in a real Next.js app:
npm run dev             # then GET /api/login, then open /
```

`/` decodes the cookie set by `/api/login` without using `SESSION_SECRET` and
prints the plaintext payload.
