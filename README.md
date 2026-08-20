# Repro: issue #69567 — `beforeInteractive` next/script not executed on pages that call `notFound()`

Reporter's linked repo (github.com/kacyee/before-interactive-2) is no longer public, so this is a
minimal re-creation. Verified with Next.js 16.3.1 (also reported on 14.2.x / 15 canaries).

## Run

```bash
npm install
npm run build
npm start
```

Then open in a browser and watch the console:

- `/` -> logs "I should be beforeInteractive", "I am afterInteractive", "Im in root layout!"
- `/not-existing-route` (no matching route, 404) -> all three log
- `/pl/newsite` (page calls `notFound()`, 404) -> **"I should be beforeInteractive" is missing**

The HTML of `/pl/newsite` contains no `self.__next_s` push at all:

```bash
curl -s localhost:3000/pl/newsite | grep -c __next_s   # 0
curl -s localhost:3000/not-existing-route | grep -c __next_s   # 1
```
