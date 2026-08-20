import { unstable_cache } from 'next/cache'

const getPost = unstable_cache(
  async () => ({ title: 'hello', createdAt: new Date() }),
  ['post'],
  { revalidate: 3600 }
)

export default async function Page() {
  const post = await getPost()
  return (
    <main>
      <p id="type">typeof createdAt: {typeof post.createdAt}</p>
      <p id="ctor">constructor: {post.createdAt?.constructor?.name}</p>
      <p id="iso">{post.createdAt.toISOString()}</p>
    </main>
  )
}
