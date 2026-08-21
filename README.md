# Repro: vercel/next.js#78092

`TypeError: Cannot read properties of null (reading 'type')` rendered as a
full-screen **Runtime Error** by the Next.js dev overlay in an app that contains
no such code. Reported as happening in "all my projects"; the reporter's linked
repo (`yhoungdev/drift-subaccount-ui`) is now 404.

## Cause shown here

The error originates from a script running outside the app bundle (a browser
extension content script; web3 wallet extensions read `.type` off a null value
on every page). Next.js dev attaches global `error` / `unhandledrejection`
listeners, so the third-party rejection is surfaced as an app "Runtime Error"
with a `<anonymous>` call stack.

## Run

```bash
npm install
npx playwright install chromium
npm run dev          # terminal 1
npm run repro        # terminal 2
```

Expected output from `npm run repro`:

```
Runtime Error
Error: Cannot read properties of null (reading 'type')
Call Stack
<unknown>
<anonymous> (4:77)
```

Without the injected script the overlay is empty. `npm run build && npm run start`
(production) shows nothing, since there is no dev overlay.
