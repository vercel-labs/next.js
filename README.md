# Reproduction attempt for vercel/next.js#72383

"Hard navigation on client-side navigation (using Link) in Next.js 15"

Minimal App Router app: `/` renders `<Link href="/x">`, `/x` renders a page.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm run start
node nav-test.mjs      # BASE=<url> to point at another server/deployment
```

`nav-test.mjs` opens the home page, stores a value on `window`, clicks the link and reports
every `document` request the browser made plus whether the `window` value survived
(i.e. whether the navigation was soft).

## Result (Next 15.0.2 and 15.5.23; next dev, next start, and deployed on Vercel)

```
docs after initial load: ["http://localhost:3000/"]
docs total: ["http://localhost:3000/"]
window state survived (soft nav): true
url: http://localhost:3000/x
```

Only the initial document is requested; the Link click is a client-side (soft) navigation.
The reported hard navigation did NOT reproduce with a plain starter app.
