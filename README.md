# Repro: Next.js issue #10084 — pages with non-ASCII (UTF-8) names 404 on the server

Next.js `16.3.1-canary.7`, Node 24.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Route | Router | Result (dev) |
| --- | --- | --- |
| `/тест` (`app/тест/page.js`) | App | **404 This page could not be found.** |
| `/пейдж` (`pages/пейдж.js`) | Pages | **404** (also 404 with `next build && next start`) |
| `/dyn/привет` (`generateStaticParams`) | App | 200 |

Requesting the percent-encoded form (`/%D1%82%D0%B5%D1%81%D1%82`) 404s too, and
client-side `<Link href="/тест">` navigation now 404s as well.

`npm run build` fails outright while prerendering the app-router page:

```
Error [InvalidCharacterError]: Invalid character
Error occurred prerendering page "/тест".
Export encountered an error on /тест/page: /тест, exiting the build.
```
