import Link from 'next/link'

export default function KeyedB() {
  return (
    <main>
      <h1>Keyed B</h1>
      <Link href="/keyed-a" id="to-keyed-a">go to Keyed A</Link>
    </main>
  )
}
