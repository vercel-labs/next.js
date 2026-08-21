# Repro: next#83671 — `forbidden.tsx` not used when `forbidden()` is thrown in `layout.tsx`

```
npm install
npm run dev
# then:
curl -i http://localhost:3000/forbidden-in-layout  # 403 generic "Forbidden" page, segment forbidden.tsx NOT rendered (bug)
curl -i http://localhost:3000/forbidden-in-page    # 403 + "SEGMENT forbidden.tsx rendered" (expected)
```

Confirmed identical on next 15.5.3 and 16.3.1, in `next dev` and `next build && next start`.
Adding a root `app/forbidden.tsx` shows the signal from `forbidden-in-layout/layout.tsx` is caught
one segment above (root boundary), not by its sibling `forbidden-in-layout/forbidden.tsx`.
