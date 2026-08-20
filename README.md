# Reproduction for vercel/next.js#73713

Clicking a `<Link href="/">` that lives in the root `layout.tsx` while already on `/`
moves focus to the first host element rendered by `page.tsx` (and scrolls the page down),
instead of leaving focus/scroll at the top of the layout.

## Layout

- `app/layout.tsx` renders a 150vh tall `<nav>` containing `<Link id="home-link" href="/">`.
- `app/page.tsx` renders `<a id="page-first-link">` as its first host element.

## Run

```bash
npm install
npm run dev          # terminal 1
npx playwright install chromium
node check-focus.mjs # terminal 2
```

## Observed (next@16.0.1, also 15.0.4-canary.49, 15.1.8, 15.3.5, 15.5.7)

```
focusin sequence: [ 'home-link', 'page-first-link' ]
document.activeElement: page-first-link
window.scrollY: 426
```

## Observed (next@16.1.7, 16.2.12, 16.3.1)

```
focusin sequence: [ 'home-link' ]
document.activeElement: home-link
window.scrollY: 0
```

So the behavior appears fixed between 16.0.1 and 16.1.7 (new app scroll handler,
`experimental.appNewScrollHandler`, which no longer focuses the first host descendant).
