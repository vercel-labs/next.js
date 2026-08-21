# Repro: App Router `generateMetadata` OpenGraph tags emitted after React-hoisted style tags

Next.js emits Metadata-API `<meta>` tags **after** the style/script tags React
hoists into `<head>`. In an app with enough hoisted CSS, `og:*` tags land past
byte 32768, which is all Slack reads when unfurling (Slack sends
`Range: bytes=0-32767`), so links never unfurl.

## Run

```bash
npm install
npm run build && npm start &
npm run check          # BASE_URL=<deployed url> npm run check for a deployment
```

`/` renders 400 hoisted `<style precedence href>` tags (a stand-in for a large
app's CSS output). `/no-styles` is the control.

## Expected

`og:*` meta tags should be emitted near the top of `<head>`, before hoisted
styles/scripts, so they stay inside the first 32KB.

## Observed (Next.js 16.3.1, production build)

`/` — 400 hoisted `<style>` tags appear at byte 157; `og:title` only at byte
~84,400, i.e. far past Slack's 32KB read window. A Slack-style request
(`Range: bytes=0-32767`, Slackbot UA) returns exactly 32,768 bytes containing
zero `og:*` tags. `/no-styles` puts `og:title` at byte ~600 and unfurls fine.
