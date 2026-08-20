# Repro: issue #61552 — overriding a dynamic segment with a static one inside parallel routes

Mirrors the reporter's CodeSandbox (not publicly fetchable) with Next.js canary.

```
npm install
npm run dev
```

| URL | Expected | Actual (16.3.1-canary.25) |
|---|---|---|
| /coolFeatureA/mountain/work | both slots render `[perspective]` | OK, params `{someSegment:"mountain",perspective:"work"}` |
| /coolFeatureA/mountain/home | slotA renders `home`, slotB renders `[perspective]` with perspective="home" | **404** |
| /coolFeatureB/mountain/work | both catch-all slots | OK |
| /coolFeatureB/mountain/home | slotA `home`, slotB catch-all with perspective=["home"] | OK (params now populated; was broken in 14.0.4) |

Adding `app/coolFeatureA/[someSegment]/@slotB/default.js` turns the 404 into a 200, but slotB
renders the default instead of `[perspective]`.
