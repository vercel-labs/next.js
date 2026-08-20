import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1 id="home">Home</h1>
      <Link href="/other" id="to-other">Go to other</Link>
    </div>
  )
}
