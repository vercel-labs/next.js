# Repro: vercel/next.js#65608 — "Could not open page.tsx in the editor" for route groups

A file inside an App Router route group (`app/(group)/...`) can never be opened from
the dev overlay on Windows, because `WINDOWS_FILE_NAME_ACCESS_LIST` in
`next/dist/next-devtools/server/launch-editor.js` does not allow parentheses.

## Run (works on Linux/macOS/Windows)

```bash
npm install
npm run repro   # exits 1 and prints the access-list error for the (group) path
```

`app/(group)/broken/page.tsx` is rejected; the identical `app/working/page.tsx`
passes the check and the editor is spawned.

## Original Windows steps

```bash
npm run dev
# open http://localhost:3000/broken, click the stack frame in the error overlay
```
