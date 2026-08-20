# Reproduction: navigating back from a second intercepted route breaks routing (vercel/next.js#66853)

Minimal reproduction of https://github.com/vercel/next.js/issues/66853.

Route structure:

```
app
  @modal/(.)notifications/page.tsx   -> "NOTIFICATIONS MODAL"
  @modal/(.)photos/[id]/page.tsx     -> "PHOTO MODAL"
  @modal/default.tsx
  notifications/page.tsx             -> "NOTIFICATIONS PAGE"
  photos/[id]/page.tsx               -> "PHOTO PAGE"
  page.tsx                           -> "Home"
```

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
npm run test:repro     # scripted browser steps, prints DOM per step
```

Manual steps: `/` -> click "View my notifications" (modal) -> click "View photo 1"
(second intercepted modal) -> browser refresh -> browser Back (once/twice).

## Observed (next@15.5.23, dev and prod)

```
[3-photo-modal]   url=/photos/1     children="Home ..."      modal="PHOTO MODAL 1"
[4-after-refresh] url=/photos/1     children="PHOTO PAGE 1"  modal=""
[5-back-1]        url=/notifications children="PHOTO PAGE 1" modal=""   <-- stale page
[6-back-2]        url=/             children="PHOTO PAGE 1"  modal=""   <-- stale page
```

After the refresh, Back only changes the URL: the `/photos/1` page stays rendered.
Same result on `next@15.0.0-canary.29` (the reported version).

## Note

With `next@16.3.1` the stale-page part no longer happens (Back renders
`NOTIFICATIONS PAGE`, then `Home`), but the intercepted modal is still not
restored after the refresh.
