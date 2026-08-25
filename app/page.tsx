import { connection } from 'next/server'
import PageClient from '../components/PageClient'

export default async function Page() {
  // Make the route dynamic so the response is rendered per request (and gets
  // the per-request nonce from middleware).
  await connection()
  // Slow enough that React flushes the shell with the `loading.tsx` fallback,
  // so the loading boundary's assets also land in the initial HTML.
  await new Promise((resolve) => setTimeout(resolve, 500))
  return (
    <main>
      <h1>home</h1>
      <PageClient />
    </main>
  )
}
