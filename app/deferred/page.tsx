import { Suspense } from 'react'
import { connection } from 'next/server'
import { queryPosts } from '../../db'

// Documented workaround: connection() in an *uncached* component,
// the cached function is called after prerendering has stopped.
async function getPosts() {
  'use cache'
  return queryPosts()
}

async function Posts() {
  await connection()
  const posts = await getPosts()
  return <pre id="posts">{JSON.stringify(posts, null, 2)}</pre>
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts />
    </Suspense>
  )
}
