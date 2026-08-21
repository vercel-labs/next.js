# Repro: dev-only hydration error in in-app WebViews (next 15.3.0 / React 19)

Related to vercel/next.js#78133 ("Hydration Error in Kakao WebView, development mode only").

The reporter's repo is an unmodified `create-next-app`, so it only errors inside the real
KakaoTalk iOS WebView. This repro replaces the WebView with Playwright WebKit + the KakaoTalk
`INAPP` user agent, plus a document-start script that mutates the document before hydration —
which is what in-app browsers do.

## Run

```bash
npm install
npx playwright install webkit

npm run dev &                       # next dev on :3000
URL=http://localhost:3000 npm run repro

npm run build && npm start &        # next start on :3001
URL=http://localhost:3001 npm run repro
```

## Observed (next 15.3.0, react 19.0.0)

| mutation done before hydration | 14.2.28 dev | 15.3.0 dev | 15.3.0 prod |
| --- | --- | --- | --- |
| none | clean | clean | clean |
| attribute/class added to `<html>`/`<body>` | clean | **"A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"** | clean |
| extra text node / element inside the root | hydration failed | "Hydration failed because the server rendered HTML didn't match the client" | minified React error #418 |

The KakaoTalk-only, dev-only, 15-only signature in the issue matches the attribute row:
React 19 reports attribute mismatches caused by third-party document mutation, React 18 (Next 14)
did not, and in production the message is stripped, so it is invisible there.
The KakaoTalk user agent alone (no document mutation) does **not** produce any hydration error.
