import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1 id="home-page">Home zone page</h1>
      <Link href="/blog/post" id="to-blog">Go to blog zone post</Link>
    </main>
  )
}
