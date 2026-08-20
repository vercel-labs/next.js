import { useRouter } from 'next/router'
import { useEffect } from 'react'
export default function Nav() {
  const router = useRouter()
  useEffect(() => {
    const t1 = setTimeout(() => router.push('/basic'), 1000)
    const t2 = setTimeout(() => router.push('/nav'), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [router])
  return <h1>client nav to /basic then back</h1>
}
