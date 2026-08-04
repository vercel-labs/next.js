'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function ProductPage() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <button onClick={() => router.replace(pathname, { scroll: false })}>
      router.replace(pathname) — should drop the hash
    </button>
  )
}
