export const dynamic = 'force-dynamic'

import Link from 'next/link'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function Page() {
  const t0 = Date.now()
  console.log(`[page] render start t=${t0}`)
  await sleep(300)
  console.log(`[page] render end   t=${Date.now()} (started ${t0})`)
  return (
    <main>
      <h1>repro 71601</h1>
      <p id="secret">SHORT_ENCRYPTED_AAAA</p>
      <Link href="/other" id="nav">go to /other (client nav, fetches RSC payload)</Link>
    </main>
  )
}
