import { headers } from 'next/headers'
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  const h = await headers()
  return (
    <main>
      <h1>CSP nonce demo</h1>
      <p id="nonce">x-nonce: {h.get('x-nonce') ?? '(none - proxy did not run)'}</p>
    </main>
  )
}
