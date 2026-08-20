import Link from 'next/link'
import Counter from './counter'

// No dynamic APIs -> statically prerendered at build time
export default function Home() {
  return (
    <main>
      <h1 id="title">Static page + middleware nonce CSP</h1>
      <Counter />
      <Link href="/other">other</Link>
    </main>
  )
}
