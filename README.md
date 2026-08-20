# Repro: next#13653 — hash scroll re-applied on browser back

Next.js 16.3.1 (also reported since 9.4.4). Both Pages Router and App Router.

## Run
```
npm install
npx playwright install chromium
npm run build && npm start   # or: npm run dev
npx playwright test          # automated assertion of the bug
```

## Manual steps
1. Open `/`, click "pages: test page WITH hash" (`/test#anchor`) — browser scrolls to `#anchor` (y=828).
2. Scroll to y=3500, click "Open another page".
3. Press browser Back.
4. **Bug:** scroll jumps back to the hash target (y=828) instead of the restored position (y=3500).
   Repeating steps with `/test` (no hash) correctly restores y=3500.
5. Same happens for the App Router routes `/app-test#anchor` → `/app-another` → Back.

## Measured (Chromium, prod server, next 16.3.1)
```
PAGES noHash   {afterNav:0,   beforeLeave:3500, afterBack:3500}
PAGES withHash {afterNav:828, beforeLeave:3500, afterBack:828}   <-- bug
APP   noHash   {afterNav:0,   beforeLeave:3500, afterBack:3500}
APP   withHash {afterNav:828, beforeLeave:3500, afterBack:828}   <-- bug
```
