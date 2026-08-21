import Link from 'next/link'
import { Counter } from '../counter'

export default function PageA() {
  return (
    <main>
      <h1>Page A</h1>
      <Counter />
      <Link href="/b" id="to-b">go to B</Link>
    </main>
  )
}
