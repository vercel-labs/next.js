import { headers } from 'next/headers'
import Counter from '../counter'

// Control case: dynamic rendering -> Next injects the middleware nonce.
export const dynamic = 'force-dynamic'

export default async function Dyn() {
  const h = await headers()
  return (
    <main>
      <h1>Dynamic page (control)</h1>
      <pre id="hdrs">x-nonce: {h.get('x-nonce')}</pre>
      <Counter />
    </main>
  )
}
