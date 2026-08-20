# Repro: Server Actions fail behind GitHub Codespaces / VS Code dev tunnels (vercel/next.js#58019)

Mirror of https://github.com/waki285/Server-Actions-Bug plus a scripted way to reproduce
without a real tunnel: the tunnel's `x-forwarded-host` (public tunnel host) never matches the
`Origin` the server sees (`localhost:3000`), so Next.js aborts every Server Action.

```bash
npm install
npm run dev            # terminal 1
npm run repro          # terminal 2  -> status: 500 "Invalid Server Actions request."
# or browse through the fake tunnel:
npm run proxy          # terminal 2, then open http://localhost:4000 and click the button
```

Server log:

```
`x-forwarded-host` header with value `abc123-3000.use.devtunnels.ms` does not match `origin` header with value `localhost:3000` from a forwarded Server Actions request. Aborting the action.
 ⨯ Error: Invalid Server Actions request.
```

Notes verified on next@16.3.1-canary.25 (and next@14.0.2-canary.11 from the original repro):
- `experimental.serverActions.allowedOrigins: ["*.devtunnels.ms"]` does **not** fix it (the request is still rejected).
- `experimental.serverActions.allowedOrigins: ["localhost:3000"]` does fix it — the allow-list is matched against the `Origin` host, not the tunnel host, which is unintuitive.
