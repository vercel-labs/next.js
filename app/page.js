'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()
  return (
    <main>
      <h1 id="home">Home</h1>
      <Link id="to-example" href="/example">Go to example (Link)</Link>
      <button id="push-example" onClick={() => router.push('/example')}>router.push</button>
    </main>
  )
}
