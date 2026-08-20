import Link from 'next/link'
import Counter from './counter'
import Infinite from './infinite'

export default function Home() {
  console.log('[server] HOME PAGE RENDERED', new Date().toISOString())
  return (
    <main>
      <h1>Home</h1>
      <Link id="to-foo" href="/foo">
        go to /foo
      </Link>
      <Counter />
      <Infinite />
    </main>
  )
}
