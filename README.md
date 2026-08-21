# Repro: hydration mismatch on `next/script` nonce with a CSP nonce (vercel/next.js#77952)

`middleware.ts` sets a per-request nonce-based CSP (as in the Next.js CSP docs) and
`app/page.tsx` renders `next/script` (both from a Server Component and a Client
Component) with `strategy="beforeInteractive"`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev
# in another shell
npm run check   # headless Chromium, prints console output, screenshot in ./artifacts
```

Or open http://localhost:3000 and look at the browser console.

## Observed (Next.js 16.3.1 / React 19.2.0, also 15.2.9 / React 19.0.0)

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
...
  <Script id="server-inl..." strategy="beforeInte..." ...>
    <script
+     nonce={undefined}
-     nonce=""
      dangerouslySetInnerHTML={{__html:"(self.__ne..."}}
    >
```

The server HTML contains `nonce="<csp nonce>"` on the `<script>` emitted by
`next/script`; browsers hide the nonce content attribute (`getAttribute('nonce')`
returns `""`), and the client render has no nonce, so hydration always mismatches.
Happens with and without an explicit `nonce` prop on `<Script>`.
