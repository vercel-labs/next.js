import Link from 'next/link'
export default function Page() {
  return (
    <main>
      <h1>App A home</h1>
      <p><Link id="ext" prefetch={false} target="_self" href="http://localhost:3000/b/page-b">absolute same-origin link to app B (prefetch=false)</Link></p>
      <p><Link id="rel" prefetch={false} href="/b/page-b">relative link to app B</Link></p>
      <p><a id="plain" href="http://localhost:3000/b/page-b">plain anchor</a></p>
    </main>
  )
}
