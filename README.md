# Repro: `next/script` does not re-run after client-side navigation back to a route (#57023)

App Router. `/services` renders two `<Script strategy="afterInteractive">` tags
(the X/Twitter widget bootstrap and a local stand-in widget script).

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
npm i -D playwright    # browser must already be installed
node verify.js
```

Manual steps: `/` -> click `about` -> click `services` (widget appears) ->
click `about` -> click `services` (widget missing) -> hard reload (widget back).

## Observed with next@16.3.1-canary.25 (dev and `next start`)

```
1-first-visit-services   {"localScriptTags":1,"localExecutions":1,"localWidgetRendered":true,"twitterIframe":1}
2-second-visit-services  {"localScriptTags":1,"localExecutions":1,"localWidgetRendered":false,"twitterIframe":0}
3-hard-reload-services   {"localScriptTags":1,"localExecutions":1,"localWidgetRendered":true,"twitterIframe":1}
```

The injected `<script>` element is left in the document when the route unmounts
and `next/script`'s load cache suppresses re-injection, so the third-party
bootstrap never runs again and the widget DOM it created (removed with the
route) is never rebuilt. Only a full page reload restores it.
