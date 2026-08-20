import Link from 'next/link'
export default function Page() {
  return (
    <div>
      <h1 id="main-page">main page</h1>
      <Link href="/does-not-exist">not found page</Link>
    </div>
  )
}
