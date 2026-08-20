import { client, cachedRequest, QUERY } from '../lib/client'

export const dynamic = 'force-dynamic'

async function hits(tag) {
  // unique URL per read so Next's fetch memoization doesn't reuse the count
  const res = await fetch(`http://localhost:3000/api/graphql?read=${tag}-${Date.now()}-${Math.random()}`, {
    cache: 'no-store',
  })
  return (await res.json()).hits
}

export default async function Page() {
  const a = await hits('a')

  // Pattern from the issue: React cache() wrapped around fetch
  await client.request(QUERY)
  await client.request(QUERY)
  await client.request(QUERY)

  const b = await hits('b')

  // Workaround: React cache() around the request function (stable primitive arg)
  await cachedRequest(QUERY)
  await cachedRequest(QUERY)
  await cachedRequest(QUERY)

  const c = await hits('c')

  return (
    <pre id="result">
      {JSON.stringify(
        {
          postsFrom_cacheWrappedFetch_3identicalCalls: b - a,
          postsFrom_cacheWrappedRequestFn_3identicalCalls: c - b,
        },
        null,
        2
      )}
    </pre>
  )
}
