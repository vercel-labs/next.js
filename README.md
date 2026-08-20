# Reproduction for vercel/next.js#44375 — `next/font` font-weight not applied in Chrome

Reporter's repo (`denvradiy/next-fonts-loading-issue`) is gone (404), so this is a minimal
rebuild on `next@canary` (16.3.1-canary.25) with the reporter's `create-next-app` + Inter setup.

Routes (each route loads Inter with a different `next/font/google` config, one per page so the
`@font-face` sets do not merge):

| route         | config                                          |
| ------------- | ----------------------------------------------- |
| `/variable`   | `Inter({ subsets: ['latin'] })`                 |
| `/weight400`  | `Inter({ subsets: ['latin'], weight: '400' })`  |
| `/weightlist` | `Inter({ subsets: ['latin'], weight: ['400','600','900'] })` |
| `/optional`   | `Inter({ subsets: ['latin'], display: 'optional' })` (Next 13.1 default) |

Each page renders the same string at `font-weight` 400/500/600/700/800/900.

## Run

```bash
npm install
npm run build && npm start &          # or: npx next start -p 3102
npx playwright install chromium
node measure2.js http://localhost:3102 # measured text width per weight, cold cache
node delay.js    http://localhost:3102 # same, with font requests delayed 3s
```

## Observed on canary (identical locally and on Vercel)

`measure2.js` — text width per `font-weight`:

```
variable   400:319 500:322 600:325 700:336 800:342 900:350   <- correct graded weights
weight400  400:319 500:319 600:319 700:319 800:319 900:319   <- font-weight has no effect
weightlist 400:319 500:319 600:325 700:350 800:350 900:350   <- 500->400, 700/800->900
```

`delay.js` (cold cache + slow font response = the reporter's hard refresh):

```
variable  (display:swap, current default)  400:319 500:322 600:325 700:336 800:342 900:350
optional  (display:optional, 13.1 default) 400:279 500:279 600:296 700:296 800:296 900:296
```

With `display: 'optional'` the downloaded Inter face is never used for that page load, so only
normal/bold remain — matching the issue and the reporter's own `display: 'swap'` workaround
(now the default). What still reproduces on canary is the `weight` variant: passing `weight` to a
variable Google font pins the `@font-face` weight(s) and silently kills graded weights, with no
build warning.
