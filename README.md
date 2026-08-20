# Repro: next.js#71311

Redirect from a Server Action takes precedence over a subsequent redirect from middleware.

## Run

```
npm install
npm run dev
```

1. Open http://localhost:3000 and click "Trigger A redirect".
2. The server action redirects to `/target?hello=xyz`; middleware appends `identifier=yolo` and redirects again.
3. Browser URL stays `/target?hello=xyz` and `useSearchParams()` (client) shows only `{"hello":"xyz"}`,
   while the server component received `{"hello":"xyz","identifier":"yolo"}`.
4. Reload: both show `hello=xyz&identifier=yolo` (expected result).

Reproduces in `next dev` and `next start` on next@14.2.15 and next@16.3.1-canary.25.
