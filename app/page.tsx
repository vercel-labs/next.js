import Link from 'next/link'
export default function Home() {
  return (
    <>
      <h1 id="home">home</h1>
      <Link href="/a" id="to-a">a Link</Link>
      <br />
      <Link href="/b" id="to-b">b Link</Link>
    </>
  )
}
