import Link from 'next/link'

export default function PageB() {
  return (
    <main>
      <h1>Page B</h1>
      <Link href="/a" id="to-a">go to A</Link>
    </main>
  )
}
