'use client'
import { useRouter } from 'next/navigation'
export default function Nav() {
  const router = useRouter()
  return (
    <nav>
      <input id="target" defaultValue="/blog/a" style={{ width: 300 }} />
      <button id="go" onClick={() => router.push((document.getElementById('target') as HTMLInputElement).value)}>Go (client nav)</button>
    </nav>
  )
}
