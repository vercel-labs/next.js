'use client'
import { useRouter } from 'next/navigation'
export default function Nav() {
  const router = useRouter()
  return (
    <nav>
      <button id="p-bitcoin" onClick={() => router.push('/coin/bitcoin')}>push bitcoin</button>
      <button id="p-ethereum" onClick={() => router.push('/coin/ethereum')}>push ethereum</button>
      <button id="p-home" onClick={() => router.push('/')}>push home</button>
      <button id="b-back" onClick={() => router.back()}>back</button>
    </nav>
  )
}
