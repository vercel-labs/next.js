'use client'

import { useRouter } from 'next/navigation'

// Mimics the reporter's coins table: rows are <button>s that call router.push().
export default function NavTest() {
  const router = useRouter()
  const ids = ['bitcoin', 'ethereum', 'solana']

  return (
    <main>
      <h1>Coins</h1>
      {ids.map((id) => (
        <button key={id} id={'push-' + id} onClick={() => router.push(`/coin/${id}`)}>
          {id}
        </button>
      ))}
    </main>
  )
}
