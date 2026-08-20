export const dynamic = 'force-dynamic'

import Link from 'next/link'

export default async function Home() {
  await new Promise((r) => setTimeout(r, 5000))
  return (
    <main>
      <h1 id="page">PAGE LOADED</h1>
      <Link href="/slow">go to /slow (client nav)</Link>
    </main>
  )
}
