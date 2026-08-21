import { queryPosts } from '../db'

// "use cache" only, no dynamic context: Next prerenders this at build time,
// which requires DB access during `next build`.
async function getPosts() {
  'use cache'
  return queryPosts()
}

export default async function Page() {
  const posts = await getPosts()
  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}
