import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>home</h1>
      <Link id="to-rows" href="/rows">
        go to rows
      </Link>
    </main>
  )
}
