import { connection } from 'next/server'
import { queryPosts } from '../../db'

// Attempt from the issue: opt out of prerendering from *inside* "use cache".
async function getPosts() {
  'use cache'
  await connection()
  return queryPosts()
}

export default async function Page() {
  const posts = await getPosts()
  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}
