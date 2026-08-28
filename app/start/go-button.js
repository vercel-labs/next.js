'use client'
import { useRouter } from 'next/navigation'

export default function GoButton() {
  const router = useRouter()
  return (
    <>
      <button id="go" onClick={() => router.push('/target')}>Go to /target (middleware redirects)</button>
      <button id="go-direct" onClick={() => router.push('/start')}>Control: push /start directly</button>
    </>
  )
}
