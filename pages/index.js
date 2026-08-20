import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1>home</h1>
      <Link href="/foo" id="no-slash">/foo</Link>
      <br />
      <Link href="/foo/" id="with-slash">/foo/</Link>
    </div>
  )
}
