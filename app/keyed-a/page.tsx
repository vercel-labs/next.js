import Link from 'next/link'
import { KeyedCounter } from '../keyed-counter'

// Variant using the suggested workaround: key the subtree by router.bfcacheId
export default function KeyedA() {
  return (
    <main>
      <h1>Keyed A</h1>
      <KeyedCounter />
      <Link href="/keyed-b" id="to-keyed-b">go to Keyed B</Link>
    </main>
  )
}
