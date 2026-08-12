import { Suspense } from 'react'
import { headers } from 'next/headers'

async function UserAgent() {
  const userAgent = (await headers()).get('user-agent')
  return <p id="user-agent">user-agent: {userAgent}</p>
}

export default function Page() {
  return (
    <main>
      <p id="static">static shell</p>
      <Suspense fallback={<p id="fallback">loading</p>}>
        <UserAgent />
      </Suspense>
    </main>
  )
}
