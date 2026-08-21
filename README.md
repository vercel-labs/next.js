# Repro: inline (React-hoisted) page metadata overwritten by layout metadata — vercel/next.js#77681

`app/layout.jsx` exports `metadata = { title: 'Metadata: Root Layout' }`.
Every page renders its own inline `<title>` (React 19 metadata hoisting) instead of using the Metadata API.

Routes:
- `/` sync server page with inline `<title>Metadata: Page</title>`
- `/async` async server page (simulates a CMS fetch) with inline `<title>`
- `/client` client component with inline `<title>`
- `/test` second page, used to test client-side navigation

## Run

```bash
npm install
npm run build && npm run start   # or: npm run dev
```

Then:

```bash
curl -s localhost:3000/ | grep -o '<title>[^<]*</title>'
```

## Expected

The page's inline title wins on the initial (SSR) document, i.e. `Metadata: Page`.

## Actual (next 16.3.1 / react 19.2.8)

The layout `<title>` is emitted first in `<head>`, so the browser and crawlers use it:

```
<title>Metadata: Root Layout</title><title>Metadata: Page</title>
```

`document.title` on initial load is `Metadata: Root Layout` for `/`, `/async` and `/client`
(with and without JS). After a client-side navigation to `/test` and back, the title is
correct (`Metadata: Page`), matching the original report.

On next 15.2.4 the ordering is only wrong when the page is async (`/async`), where the SSR
HTML is `<title>Metadata: Root Layout</title><title>Metadata: Async Page</title>`.
