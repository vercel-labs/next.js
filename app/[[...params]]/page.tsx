import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <h1 id="home">CMS catch-all page</h1>
      <Link href="/photos/1">Open photo 1 (modal)</Link>
      <br />
      <Link href="/photos">All photos</Link>
    </main>
  )
}
