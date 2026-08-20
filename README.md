# Reproduction for vercel/next.js#44901

Client components imported by a **server** root layout and wrapped in `React.memo`
unmount + remount on every client-side `<Link>` navigation.

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3000
# in another shell (needs: npx playwright install chromium)
npm run check
```

`check.mjs` loads `/`, navigates to `/about` and back, and prints browser console logs.

## Results (headless Chromium, `reactStrictMode: false`)

| next | react | on navigation |
| --- | --- | --- |
| 15.2.0 | 18.3.1 | all `memo` components UNMOUNT + MOUNT (plain client component stays mounted) |
| 15.2.0 | 19.0.0 | same remount |
| 15.5.4 | 19.0.0 | same remount |
| 16.0.0 | 19.0.0 | no remount |
| 16.3.1-canary.25 | 19.2.0 | no remount (also with a dynamic layout that awaits `cookies()`) |

Change the `next` version in `package.json` to switch between the buggy and fixed behavior.
