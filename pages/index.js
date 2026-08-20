import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href="/a/">a/</Link>
      <br />
      <Link href="/b.git/">b.git/</Link>
    </div>
  )
}
