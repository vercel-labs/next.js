async function getPost() {
  'use cache'
  return { title: 'hello', createdAt: new Date() }
}

export default async function Page() {
  const post = await getPost()
  return <p>use cache: {post.createdAt.toISOString()} / {post.createdAt.constructor.name}</p>
}
