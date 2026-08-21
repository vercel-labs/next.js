import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1 id="page">HOME</h1>
      <Link href="/some-route" id="to-some-route">go to /some-route</Link>
    </div>
  )
}
