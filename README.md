# Repro: next.js#62675 — `window.history.pushState` to another route leaves the view stale, Back/Forward never re-renders it

App Router app with routes `/`, `/a`, `/b`, `/c`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
node test.js           # scenarios 1-3
node test2.js          # scenarios 4-5 (the clearest desync)
```

`test.js`/`test2.js` drive Chromium via Playwright and print `url` + rendered heading after each step.
Set `CHROME_PATH` if you want a specific Chromium binary; `BASE` overrides `http://localhost:3000`.

## Observed (next 14.1.0 and 16.3.1-canary.25, dev)

```
s4-1-pushed-c:    url=/c view="Home"     # pushState(null,'','/c') does not render /c
s4-2-on-b:        url=/b view="Page B"
s4-3-back-url-c:  url=/c view="Home"     # Back: URL is /c, view still Home
s4-5-fwd-url-c:   url=/c view="Home"
s5-4-back-url-c:  url=/c view="Page A"   # Back onto pushed entry keeps the old page
9-reload-at-c:    url=/c view="Page C"   # hard load of /c proves /c exists and renders
```

Expected: history entries whose URL points at a different route render that route on
popstate (back/forward), instead of permanently showing the page that called `pushState`.
