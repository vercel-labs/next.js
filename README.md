# Repro: text fragment (`#:~:text=`) stripped from the URL by the Next.js client router (#84456)

Two Next.js apps (pages router `output: 'export'`, and app router `next start`) plus a plain
static HTML control page with identical markup. Each page contains the word `unicornmagic`
about 6400px down the document.

## Run

```bash
npm run setup      # installs deps + builds both apps
npm run serve      # static control :3002, next export :3001, next app router :3003
npm run check      # Playwright + CDP: reads the real URL-bar entry for each page
```

## Result (Chromium 151)

```
static-html:          urlBar=http://localhost:3002/#:~:text=unicornmagic keptFragment=true  scrollY=6440
next-pages-export:    urlBar=http://localhost:3001/                      keptFragment=false scrollY=6440
next-app-router-prod: urlBar=http://localhost:3003/                      keptFragment=false keptFragment=false
```

The scroll-to-text still happens, but both Next.js routers call
`history.replaceState(state, '', '/')` during hydration (see `npm run probe`), which rewrites the
current history entry and drops the fragment directive from the URL bar. Reloading or copying the
URL then loses the text fragment. The static control keeps it.
