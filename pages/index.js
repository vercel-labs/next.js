import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <Link href="/page3" id="link-hoc">HOC undefined gSSP</Link>
      <br />
      <Link href="/page2" id="link-valid">valid gSSP</Link>
    </div>
  )
}
