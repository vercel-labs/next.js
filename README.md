# Repro: scroll position clamped to previous page height after back navigation (#86528)

Next.js issue: https://github.com/vercel/next.js/issues/86528

## Setup

- `/` (Home) is 4000px tall, with a `<Link>` to `/page2` at the very bottom.
- `/page2` is 2000px tall and calls a Server Function (`cookies().set(...)`) from `useEffect` on mount.
  That cookie write invalidates the client Router Cache entry for `/`.
- Going back (browser back button or `router.back()`) forces a refetch of `/`.

## Run

```bash
npm install
npm run dev        # or: npm run build && npm start
node test-scroll.js  # scripted Playwright check (BASE_URL env, default http://localhost:3000)
```

Manual steps: open `/`, scroll to the bottom, click the link to `/page2`, wait for
"cookie action: ok", press the browser back button.

## Observed

Home is restored at `scrollY = 1221` (the max scroll of the 2000px-tall Page2) instead of
`3221` (the position it had before navigating). Scroll restoration runs before the
refetched Home content is committed, so the position is clamped to the old document height.
