# Repro: intercepting routes stop working when the path goes through a `rewrite` (issue #71116)

Next.js: 16.3.1-canary.25 (also reported on 14.2.15 / 15.0.3 / 16.1.1)

## Structure
```
app/[locale]/page.tsx                       -> <Link href="/en/vacancy/1">
app/[locale]/vacancy/[id]/page.tsx          -> "FULL PAGE vacancy 1"
app/[locale]/@modal/(.)vacancy/[id]/page.tsx-> "MODAL intercepted vacancy 1"
```
`next.config.mjs` rewrites `/:locale/:vacancy/:id` -> `/:locale/vacancy/:id`.

## Run
```
npm install
npm run dev            # rewrite enabled  -> BUG: full page, modal never renders
NO_REWRITE=1 npm run dev  # no rewrite    -> OK: modal is intercepted
```
Then open http://localhost:3000/en and click "open vacancy 1".

Automated check (server must be running):
```
npx playwright install chromium
node check.mjs                          # rewrite   -> modal? false full? true
PORT=3001 LABEL=no-rewrite node check.mjs  # control -> modal? true  full? false
```
Also fails with `next build && next start`.
