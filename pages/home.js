import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1 id="home">Home (rewritten from /)</h1>
      <p><Link id="l1" href="/test/">1. /test/ (rewrite with trailing slash)</Link></p>
      <p><Link id="l2" href="/no-slash">2. /no-slash (rewrite without trailing slash)</Link></p>
      <p><Link id="lhome" href="/">Home button</Link></p>
    </div>
  )
}
