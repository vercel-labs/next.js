import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>next#94740 repro</h1>
      <p>
        <Link href="/external-pkg">/external-pkg</Link> (next/image rendered from
        an external node_modules package) 500s in production SSR on Vercel.
      </p>
      <p>
        <Link href="/bundled">/bundled</Link> (next/image imported directly by
        the page) works, because __NEXT_IMAGE_OPTS is inlined there.
      </p>
    </main>
  )
}
