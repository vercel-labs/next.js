# Repro: intercepting route not intercepted when it was the entry point (vercel/next.js#82769)

Based on the official `nextgram` example, with a `Home` link added to `app/photos/[id]/page.tsx`.

## Steps
1. `npm install && npm run build && npm start`
2. Open `http://localhost:3000/photos/1` directly (hard navigation, no modal - expected).
3. Click **Home**.
4. Click the card **1**.

Expected: the `@modal/(.)photos/[id]` intercepting route renders the modal (as it does for cards 2-6).
Actual (next 15.5.23, and 15.4.x as reported): a full photo page renders, no modal.

Automated check: `node repro-test.mjs http://localhost:3000`
Prints `modal count 0` for photo 1 (bug) and `control photo2 modal count 1`.

## Notes
- Root cause signal: on the home page the router prefetches `/photos/2..6` (with `Next-Url`, so the interception is included) but skips `/photos/1`, because the entry-page navigation already seeded the client router cache for `/photos/1` with the non-intercepted payload.
- Setting `experimental: { clientSegmentCache: true }` in `next.config.js` on 15.5.23 fixes it, and Next 16.3.1 (segment cache on by default) is not affected.
