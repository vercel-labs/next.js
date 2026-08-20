'use client'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => { console.log('nav', pathname, searchParams.toString()) }, [pathname, searchParams])
  return null
}

export default function Providers({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
      {children}
    </>
  )
}
