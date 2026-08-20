import { GraphQLClient } from 'graphql-request'
import { cache } from 'react'

// Exactly the pattern from the issue: wrap fetch in React `cache`
export const client = new GraphQLClient('http://localhost:3000/api/graphql', {
  fetch: cache(async (url, init) => fetch(url, { ...init, cache: 'no-store' })),
})

export const QUERY = `query Viewer { viewer { name } }`

// Workaround: memoize at the request-function level (stable, primitive args)
export const cachedRequest = cache(async (query) => client.request(query))
