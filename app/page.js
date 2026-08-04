'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <button onClick={() => router.replace(pathname, { scroll: false })}>
      static route: router.replace(pathname)
    </button>
  )
}
