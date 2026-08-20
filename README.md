# Reproduction: focus is not moved after client-side navigations (vercel/next.js#49386)

Next.js version: 16.3.1-canary.25 (App Router)

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start   # or: npm run dev
npm test                     # BASE_URL=http://localhost:3000 by default
```

## Observed (dev and production, canary 16.3.1-canary.25)

```
[1] after clicking sidebar <Link href="/a">     activeElement = a#link-a "Page A"
[2] after keyboard Enter on sidebar link        activeElement = a#link-b "Page B"
[3] link removed after nav                      activeElement = body
[4] baseline full page load (plain <a>)         activeElement = body
```

- After an App Router client-side navigation the focus stays on the clicked
  `<Link>` inside the persistent layout, so a keyboard/screen-reader user resumes
  tabbing from the middle of the old page instead of the top of the new document.
- When the activated link is removed from the DOM by the navigation (case 3),
  focus falls back to `<body>` — i.e. it is lost, and there is no API to control it.
- A real browser navigation (case 4) resets focus to the document, which is the
  behavior the client router does not emulate.
