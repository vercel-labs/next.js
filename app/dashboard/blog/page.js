export default async function BlogPage() {
  await new Promise((r) => setTimeout(r, 300))
  return <h1 id="blog">Blog</h1>
}
