# Reproduction for vercel/next.js#66503 — `graphql-request` + React `cache()`

Next.js 15.5.4 / React 19. `npm install && npm run dev`, then open http://localhost:3000

`lib/client.js` uses the exact pattern from the issue (a `GraphQLClient` whose `fetch`
option is wrapped in React `cache()`), plus the working alternative
(`cache()` around the request function itself).

The page issues 3 identical GraphQL queries with each approach and reports how many
POST requests actually reached `/api/graphql`:

```json
{
  "postsFrom_cacheWrappedFetch_3identicalCalls": 3,
  "postsFrom_cacheWrappedRequestFn_3identicalCalls": 1
}
```

So `cache(fetch)` never memoizes, because `graphql-request` builds a fresh `init`
object per call and React `cache` compares arguments by reference. Memoizing at the
request-function level (primitive/stable args) dedupes to a single POST.
The docs page linked in the issue does not cover this.
