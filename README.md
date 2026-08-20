# Repro: vercel/next.js#62903 — request `host` header is wrong in middleware when `redirect()`ing in a Server Action

Based on the reporter's repro (https://github.com/kevinmitch14/redirects), with `x-forwarded-host` added to the middleware log.

## Steps

```bash
npm install
npm run build
npm start            # http://localhost:3000
# in another shell
npm i playwright && npx playwright install chromium
BASE=http://tenant.localhost:3000 npm run verify
# or manually: open http://tenant.localhost:3000 and press "Submit"
```

Watch the `next start` stdout.

## Observed

Next.js `14.2.0-canary.0` (version in the issue):

```
{ PATH: '/',     HOST: 'tenant.localhost:3000' }
{ PATH: '/blog', HOST: '[::]:3000' }          <-- wrong (issue title)
```

Latest canary (16.3.1-canary.25): the `[::]` part is fixed but the original host is
still lost on the internal redirect request:

```
{ PATH: '/',     HOST: 'tenant.localhost:3000', X_FORWARDED_HOST: 'tenant.localhost:3000' }
{ PATH: '/blog', HOST: 'localhost:3000',        X_FORWARDED_HOST: 'tenant.localhost:3000' }
```

## Expected

The `host` header of the redirect-follow request should be the original request host
(`tenant.localhost:3000`), as it was in 14.1.0. This breaks multi-tenant apps that
derive the tenant from `host` (see https://github.com/vercel/platforms/blob/main/middleware.ts).
`x-forwarded-host` is currently the only reliable workaround.
