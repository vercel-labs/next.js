# Reproduction attempt for vercel/next.js#44556

"Image was preloaded using link preload but not used within a few seconds" with
`next/image` + `priority`.

The linked "reproduction" in the issue is a StackOverflow question, so this app was
written from the snippet in the issue body and extended with every scenario that could
plausibly leave the `<link rel="preload" as="image">` unused.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start           # http://localhost:3000
node scripts/matrix.js http://localhost:3000 /sizes /fill /blur /unopt /two /swap /lazyauto /lazyfar
node scripts/one.js http://localhost:3000/basic      # pages router, issue snippet
node scripts/one.js http://localhost:3000/manual     # control: really unused preload
```

`scripts/one.js` / `scripts/matrix.js` load the route in Chromium, wait 6-7s after the
`load` event and print every console message that contains
"preloaded using link preload", plus every `/_next/image` request and the `currentSrc`
of each `<img>`.

## Routes

pages router
- `/basic` – exact snippet from the issue (`width/height/priority`)
- `/hidden` – priority image inside `display:none` parent
- `/spinner` – priority image unmounted 300ms after hydration (the reporter's loading ball)
- `/redirect`, `/nav` – priority image + immediate client-side navigation
- `/manual`, `/manual2` – **controls**: hand written unused `<link rel=preload as=image>`
  (with `href` and with `imagesrcset`), these do print the Chrome warning

app router
- `/sizes`, `/fill`, `/blur`, `/unopt`, `/two`, `/swap`, `/art`, `/suspense`, `/scroll`
- `/sizesauto`, `/lazyauto` (`preload` + `loading="lazy"` + `sizes="auto"`), `/lazyfar`

## Observed (Next 16.3.1-canary.25, 15.1.6 and 13.1.1, Chromium 151, dev + prod)

- No route that uses `next/image` with `priority`/`preload` produced the Chrome warning,
  at devicePixelRatio 1 / 1.25 / 1.5 / 1.75 / 2 / 2.5 / 3, on emulated phones, on reloads
  with a warm HTTP cache and after client side navigation.
- The two control routes do produce it, so the harness detects the warning.
- `/lazyauto` (`preload` + `loading="lazy"` + `sizes="auto"`) downloads the image twice
  (preload picks `w=1080` from `imagesizes="auto"`, the lazy `<img>` then fetches `w=256`)
  yet Chrome still does not log the warning.
